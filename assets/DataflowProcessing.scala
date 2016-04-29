trait DataflowInteractionProcessingModule {

class DataflowInteractionProcessor(val projectId: ProjectId)(implicit ec: ExecutionContext)
  extends InteractionProcessor[InteractionProcessorConfig]
    with PipelineOptions
    with LazyLogging {
  type Conf = InteractionProcessorConfig

  override def process(config: Conf): ProcessResult = {
    bootstrapGoogleStorageEnvironment(projectId, config)
    startProcessingPipeline(config)
  }

  private def startProcessingPipeline(config: Conf): ProcessResult = {
    logger.info(s"Starting interaction processor pipeline")
    require(config.datasetIds.nonEmpty, "Can't run the pipeline without DatasetIds")
    val options = createOptions(projectId, config)
    val pipeline: Pipeline = Pipeline.create(options)
    val sourceBucket = config.sourceBucket

    val uniqueFileIdentifier = Done.uniqueFileIdentifier()
    import AdPlatformTransforms._
    val adPlatformTransforms: List[(PCollection[TableRow]) ⇒ PDone] =
      config.uploaderConfigs flatMap {

        case gdc: GoogleDoubleClickFileUploaderConfig ⇒
          createGoogleDoubleClickTransforms(
            gdc.segmentIds,
            gdc.sourceFilesFunction(sourceBucket, uniqueFileIdentifier)
          )

        case af: AdFormFileUploaderConfig ⇒
          createAdFormTransform(
            af.segmentIds,
            af.sourceFilesFunction(sourceBucket, uniqueFileIdentifier).head
          )

        case omw: OperaMediaworksFileUploaderConfig ⇒
          createOperaMediaworksTransform(
            omw.segmentIds,
            omw.sourceFilesFunction(sourceBucket, uniqueFileIdentifier, config.clientName.some)
          )

        case _ ⇒ Nil
      }

    val interactions: PCollection[TableRow] = pipeline.
      apply(BigQueryRead.interactionsByDatasetIds(
        config.datasetIds,
        config.databaseName,
        config.tableName,
        config.categories
      ))

    adPlatformTransforms foreach (transform ⇒ transform(interactions))

    new PipelineProcessResult(pipelineResultFunc = pipeline.run, uniqueFileIdentifier)
  }

}

trait PipelineOptions {
  def createOptions(projectId: ProjectId, config: ProcessorConfig) = {
    val options = PipelineOptionsFactory.create.as(classOf[DataflowPipelineOptions])
    options.setRunner(classOf[DataflowPipelineRunner])
    options.setProject(projectId.fullName)
    options.setStagingLocation(s"gs://${config.sourceBucket.value}/jars")
    options.setStreaming(false)
    options.setJobName(config.jobName)
    options.setZone("europe-west1-b")
    options.setWorkerMachineType("g1-small")
    options.setNumWorkers(1) //this is set to 1 for now to save processing cost in GCloud
    options
  }
}
class PipelineProcessResult(pipelineResultFunc: () ⇒ PipelineResult, uniqueFileIdentifier: UniqueFileIdentifier)(implicit ec: ExecutionContext) extends ProcessResult {
val result = Try(pipelineResultFunc())

def status: ProcessStatus = result match {

  case Success(r) ⇒
    r.getState match {
      case PipelineResult.State.RUNNING   ⇒ Running
      case PipelineResult.State.DONE      ⇒ Done(uniqueFileIdentifier)
      case PipelineResult.State.FAILED    ⇒ Failed
      case PipelineResult.State.CANCELLED ⇒ Cancelled
      case _                              ⇒ Unknown
    }
  case Failure(ex: DataflowJobAlreadyExistsException) ⇒ AlreadyRunning
  case Failure(ex)                                    ⇒ ExceptionThrown(ex)

}

// This delay is this high so we don't choke the Pipeline
override def statusCheckDelay: FiniteDuration = 10.seconds
}

abstract class SDoFn[I, O] extends DoFn[I, O] {
  type Context[II <: I, OO <: O]        = DoFn[I, O]#Context
  type ProcessContext[II <: I, OO <: O] = DoFn[I, O]#ProcessContext

  def name: String = getClass.getSimpleName.replaceAll("\\$", "")
}

object NamedParDo {
  def of[I, O](fn: SDoFn[I, O]) = ParDo named fn.name of fn
}

object NoopParDo {
  def noop[T] = NamedParDo of new SDoFn[TableRow, T] {
    override def processElement(c: DoFn[TableRow, T]#ProcessContext): Unit = ()
  } named "Noop"
}

object SerializableFunction {
  def from[I, O](fn: (I) ⇒ O): GSerializableFunction[I, O] = {
    new GSerializableFunction[I, O] {
      override def apply(input: I): O = fn.apply(input)
    }
  }
}

object Filter {
  type JBoolean = java.lang.Boolean
  def byPredicate[I](fn: (I) ⇒ Boolean) =
    GFilter.byPredicate[I, GSerializableFunction[I, JBoolean]](SerializableFunction.from[I, JBoolean](fn.andThen(b ⇒ b: JBoolean)))
}
object TextIOWriteWithoutSharding {
  def to(filePath: FilePath) =
    TextIO.Write.to(s"gs://${filePath.value}").withoutSharding().
    named(s"TextIOWriteNoSharding of ${filePath.value.split("/").last}")
}

trait TableRowFormatting {
  def nonEmpty(obj: Object): Boolean =
    Option(obj).map(_.asInstanceOf[String]).getOrElse("").nonEmpty

  def formatter(deviceIdType: DeviceIdType, segmentsPart: String): DeviceIdFormatterFn

  def deviceIdTypeFilter(deviceIdType: DeviceIdType): GFilter[TableRow] =
    Filter byPredicate ((tr: TableRow) ⇒
      nonEmpty(tr.get(deviceIdType.name))) named s"${deviceIdType.name}Filter"

  def fieldFromTableRow(deviceIdType: DeviceIdType) =
    deviceIdType match {
      case IDFA ⇒ GetIDFAFieldFromTableRowFn.asNamedParDo
      case AdId ⇒ GetAdIdFieldFromTableRowFn.asNamedParDo
      case _    ⇒ NoopParDo.noop[DeviceId]
    }

  def deviceIdTypeFormatter(deviceIdType: DeviceIdType, segmentsPart: String): Bound[DeviceId, String] = NamedParDo of formatter(deviceIdType, segmentsPart) named s"${deviceIdType.name}-$segmentsPart-Formatter"

  def handleEmptySegmentIds(input: PCollection[TableRow], segmentIds: List[String])(pCollection: ⇒ PCollection[String]) = {
    if (segmentIds.nonEmpty) pCollection
    else input.apply(NoopParDo.noop[String]).setCoder(StringUtf8Coder.of())
  }
}

case class TableRowsToGoogleDoubleClickFormat(googleAudienceSegmentIds: List[String],
                                              deviceIdType: DeviceIdType)
  extends PTransform[PCollection[TableRow], PCollection[String]](s"TableRowsToGoogleDoubleClickFormat for ${deviceIdType.name}")
    with TableRowFormatting {

  def formatter(deviceIdType: DeviceIdType, segmentsPart: String) = DeviceIdFormatterFn(deviceId ⇒ s"${deviceId.value},$segmentsPart")
  override def apply(input: PCollection[TableRow]): PCollection[String] = {
    val pCollection: PCollection[_ <: DeviceId] = input.
      apply(deviceIdTypeFilter(deviceIdType)).
      apply(fieldFromTableRow(deviceIdType))

    import scala.collection.JavaConverters._
    val collections = googleAudienceSegmentIds.map(segmentId ⇒
      pCollection.apply(deviceIdTypeFormatter(deviceIdType, segmentId))).asJava
    handleEmptySegmentIds(input, googleAudienceSegmentIds)(
      PCollectionList.of(collections).apply(Flatten.pCollections[String])
    )
  }
}

case class TableRowsToAdFormFormat(adFormSegmentIds: List[String])
  extends PTransform[PCollection[TableRow], PCollection[String]]
    with TableRowFormatting {

  def formatter(deviceIdType: DeviceIdType, segmentsPart: String) = DeviceIdFormatterFn((deviceId: DeviceId) ⇒ s"""${deviceId.value}\t$segmentsPart""")

  override def apply(input: PCollection[TableRow]): PCollection[String] = {

    val IDFAs: PCollection[String] = input.
      apply(deviceIdTypeFilter(IDFA)).
      apply(GetIDFAFieldFromTableRowFn.asNamedParDo).
      apply(deviceIdTypeFormatter(IDFA, adFormSegmentIds.mkString(",")))

    val adIds: PCollection[String] = input.
      apply(deviceIdTypeFilter(AdId)).
      apply(GetAdIdFieldFromTableRowFn.asNamedParDo).
      apply(deviceIdTypeFormatter(AdId, adFormSegmentIds.mkString(",")))

    handleEmptySegmentIds(input, adFormSegmentIds)(
      PCollectionList.of(IDFAs).and(adIds).apply(Flatten.pCollections[String])
    )
  }
}

case class TableRowsToOperaMediaworksFormat(operaMediaworksSegmentIds: List[String],
                                            deviceIdType: DeviceIdType)
  extends PTransform[PCollection[TableRow], PCollection[String]](s"TableRowsToOperaMediaworksFormat for ${deviceIdType.name}")
    with TableRowFormatting {

  def formatter(deviceIdType: DeviceIdType, segmentsPart: String) =
    DeviceIdFormatterFn((deviceId: DeviceId) ⇒ s"""${deviceId.value},${deviceIdType.os},$segmentsPart""")

  override def apply(input: PCollection[TableRow]): PCollection[String] = {
    handleEmptySegmentIds(input, operaMediaworksSegmentIds)(
      input.
        apply(deviceIdTypeFilter(deviceIdType)).
        apply(fieldFromTableRow(deviceIdType)).
        apply(deviceIdTypeFormatter(deviceIdType, operaMediaworksSegmentIds.mkString(",")))
    )
  }
}

object BigQueryRead {
  def createInteractionsByDatasetIdsQuery(datasetIds: List[DatasetId], databaseName: DatabaseName, tableName: TableName, categories: List[Category]) =
    s"""
       |SELECT idfa, datasetId, adId
       |FROM [${databaseName.value}.${tableName.value}]
       |where datasetId in (${datasetIds.map(dsi ⇒
         s"'${dsi.value}'").mkString(",")})
       |and category in (${categories.map(c ⇒
         s"'${c.value}'").mkString(",")})
       |group by idfa, adId, datasetId;
     """.stripMargin

  def interactionsByDatasetIds(datasetIds: List[DatasetId], databaseName: DatabaseName, tableName: TableName, categories: List[Category]) =
    BigQueryIO.Read.named("GetInteractionsByDatasetId").
      fromQuery(createInteractionsByDatasetIdsQuery(
        datasetIds,
        databaseName,
        tableName,
        categories
      ))

  def createRawInteractionsQuery(databaseName: DatabaseName, tableName: TableName) =
    s"""
       |SELECT * FROM [${databaseName.value}.${tableName.value}];
     """.stripMargin

  def rawInteractions(databaseName: DatabaseName, tableName: TableName) =
    BigQueryIO.Read.named("GetRawInteractions").
      fromQuery(createRawInteractionsQuery(databaseName, tableName))
}

trait GetFieldFromTableRowFn[O] extends SDoFn[TableRow, O] {
  def fieldName: String
  def apply: (String) ⇒ O
  def asNamedParDo: Bound[TableRow, O]

  override def processElement(c: ProcessContext[TableRow, O]): Unit = {
    val tableRow: TableRow = c.element()
    val interaction = tableRow.get(fieldName).asInstanceOf[String]
    c.output(apply(interaction))
  }
}
object GetIDFAFieldFromTableRowFn extends GetFieldFromTableRowFn[IDFA] {
  val fieldName = IDFA.name
  val asNamedParDo = NamedParDo of this named "IDFA from TableRow"
  override def apply = IDFA(_)
}

object GetAdIdFieldFromTableRowFn extends GetFieldFromTableRowFn[AdId] {
  val fieldName = AdId.name
  val asNamedParDo = NamedParDo of this named "AdId from TableRow"
  override def apply = AdId(_)
}
object GetRawJsonFromTableRowFn extends GetFieldFromTableRowFn[String] {
  val fieldName = "raw_json"
  val asNamedParDo = NamedParDo of this named "Raw Json from TableRow"
  override def apply = identity
}

case class DeviceIdFormatterFn(textFormatter: (DeviceId) ⇒ String) extends SDoFn[DeviceId, String] {
  override def processElement(c: ProcessContext[DeviceId, String]): Unit = {
    c.output(textFormatter(c.element()))
  }
}

object AdPlatformTransforms {

  def createGoogleDoubleClickTransforms(googleAudienceSegmentIds: List[String],
    sourceFiles: List[SourceFile]): List[(PCollection[TableRow]) ⇒ PDone] = {

    sourceFiles flatMap { case SourceFile(filePath, deviceIdType) ⇒
      deviceIdType map { dit ⇒
        (pCollection: PCollection[TableRow]) ⇒
          pCollection.
            apply(TableRowsToGoogleDoubleClickFormat(
              googleAudienceSegmentIds, dit)).
            apply(TextIOWriteWithoutSharding.to(filePath) named
            s"Write ${deviceIdType.map(_.name).getOrElse("")} CSV file")
      }
    }
  }

  def createOperaMediaworksTransform(operaMediaworksSegmentIds: List[String],
                                     sourceFiles: List[SourceFile]): List[(PCollection[TableRow]) ⇒ PDone] = {
    sourceFiles flatMap { case SourceFile(filePath, deviceIdType) ⇒
      deviceIdType map { dit ⇒
        (pCollection: PCollection[TableRow]) ⇒
          pCollection.
            apply(TableRowsToOperaMediaworksFormat(operaMediaworksSegmentIds, dit)).
            apply(TextIOWriteWithoutSharding.to(filePath) named s"Write ${deviceIdType.map(_.name).getOrElse("")} CSV file to Storage")
      }
    }
  }

  def createAdFormTransform(adFormSegmentIds: List[String],
                            sourceFile: SourceFile): List[(PCollection[TableRow]) ⇒ PDone] = {
    ((pCollection: PCollection[TableRow]) ⇒
      pCollection.
        apply(TableRowsToAdFormFormat(adFormSegmentIds)).
        apply(TextIOWriteWithoutSharding.to(sourceFile.filePath) named s"Write CSV file to Storage")) :: Nil
  }

}
