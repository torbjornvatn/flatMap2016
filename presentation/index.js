// Import React
import React from "react";

// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Deck,
  Fill,
  Fit,
  Heading,
  Image,
  Layout,
  Link,
  ListItem,
  List,
  Markdown,
  Quote,
  Slide,
  Spectacle,
  Text
} from "spectacle";

import CodeSlide from 'spectacle-code-slide';

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Import custom component
import Interactive from "../assets/interactive";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");


const images = {
  background: require("../assets/background.png"),
  whowhat1: require("../assets/whowhatwhen1.jpg"),
  whowhat2: require("../assets/whowhatwhen2.jpg"),
  whowhat3: require("../assets/whowhatwhen3.jpg"),
  whowhat4: require("../assets/whowhatwhen4.jpg"),
  world: require("../assets/world.jpg"),
  cloud: require("../assets/google_cloud.png"),
  cloud_icon: require("../assets/google_cloud_icon.png"),
  kubernetes: require("../assets/kubernetes.png"),
  dataflow: require("../assets/dataflow.png"),
  akka: require("../assets/akka.png"),
  spark: require("../assets/spark.png"),
  spotify: require("../assets/spotify.png"),
  architecture: require("../assets/architecture.png"),
  logo: require("../assets/unacast_logo.png"),
  mc: require("../assets/mc.gif")
};

preloader(images);

const theme = createTheme({
  primary: "#ff4081"
}, {
  primary: "Roboto Slab"
});

export default class Presentation extends React.Component {
  render() {
    return (
      <Spectacle theme={theme}>
        <Deck transition={["zoom", "slide"]} transitionDuration={500} progress="bar">
          <Slide transition={["zoom"]} bgImage={images.background.replace("/", "")} bgDarken={0.30}>
            <Heading size={1} fit caps lineHeight={1} textColor="white">
              Go with the Dataflow!
            </Heading>
            <Heading size={2} fit textColor="white">
              Use Google Dataflow for Fun & Profit
            </Heading>
            <Text textSize="1.5em" margin="20px 0px 0px" bold textColor="white">
              @torbjornvatn
            </Text>
            <Image src={images.logo.replace("/", "")} margin="70px auto 40px" height="40px"/>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" bgImage={images.world.replace("/", "")} bgDarken={0.60}>
            <Heading size={2} fit textColor="white" textFont="primary">
              What is Unacast?
            </Heading>
            <Heading size={2} fit textColor="white" textFont="primary">
              What are we trying to do?
            </Heading>
          </Slide>

          <Slide transition={[]}>
            <Heading size={3} fit textColor="white" textFont="primary" lineHeight={1.5}>
              Warning!
            </Heading>
            <Heading size={2} fit textColor="white" textFont="primary">
              Corporate slides will follow
            </Heading>
          </Slide>
          <Slide transition={["zoom"]}>
              <Image src={images.whowhat1.replace("/", "")} fill margin="0px 0px 0px -100px" width="120%"/>
          </Slide>
          <Slide transition={["zoom"]}>
            <Image src={images.whowhat2.replace("/", "")} fit margin="0px 0px 0px -100px" width="120%"/>
          </Slide>
          <Slide transition={["zoom"]}>
            <Image src={images.whowhat3.replace("/", "")} fit margin="0px 0px 0px -100px" width="120%"/>
          </Slide>
          <Slide transition={["zoom"]}>
            <Image src={images.whowhat4.replace("/", "")} fit margin="0px 0px 0px -100px" width="120%"/>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={1} caps fit textColor="white" textFont="primary">
              Architecture
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Image src={images.cloud.replace("/", "")} fit margin="0px 0px 0px 0px" width="100%"/>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Image src={images.architecture.replace("/", "")} fit margin="0px 0px 0px -100px" width="120%"/>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={1} textColor="white" textFont="primary" margin="0px 0px 80px">
              So what is this Dataflow thing?
            </Heading>
            <Layout>
              <Appear>
                <Fill>
                  <Image src={images.dataflow.replace("/", "")} margin="80px 0px 0px 0px"/>
                </Fill>
              </Appear>
              <Appear>
                <Fill>
                  <Heading size={2} caps textColor="white" margin="100px 0px 0px 0px">
                    ≈
                  </Heading>
                </Fill>
              </Appear>
              <Appear>
                <Fill>
                  <Image src={images.spark.replace("/", "")} width="300px" />
                </Fill>
              </Appear>
            </Layout>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" bgImage="https://camo.githubusercontent.com/79e5b3c1ac55cc63dd408cb83202ae4ebd54634b/68747470733a2f2f63312e737461746963666c69636b722e636f6d2f372f363139392f363039373838323735325f336562306239396439632e6a7067" bgDarken={0.30}>
            <Heading size={2} fit textColor="white" textFont="primary" margin="0px 0px 100px">
              Enter the Honeybatcher
            </Heading>
            <Layout>
              <Appear>
                <Fill>
                  <Image src={images.akka.replace("/", "")} width={300} margin={40}/>
                </Fill>
              </Appear>
              <Appear>
                <Fill>
                  <Heading size={2} caps textColor="white" margin="100px 0px 0px 40px">
                    +
                  </Heading>
                </Fill>
              </Appear>
              <Appear>
                <Fill>
                  <Image src={images.cloud_icon.replace("/", "")} width={300}/>
                </Fill>
              </Appear>
            </Layout>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={1} textColor="white" textFont="primary">
              Show me some code already!
            </Heading>
          </Slide>

          <CodeSlide
            transition={[]}
            lang="scala"
            code={require("raw!../assets/DataflowProcessing.scala")}
            notes="<ul>
            <li>talk about that</li>
            <li>and that</li>
            <li>and this</li>
            <li>and something else</li>
            </ul>"
            textSize={20}
            ranges={[
              { loc: [0, 1], title: "How we use Dataflow from Scala" },
              { loc: [8, 12], note: "Setup and starting the pipeline" },
              { loc: [16, 18], note: "The pipeline needs some setup"},
              { loc: [62, 73], note: "Mostly Google Cloud settings"},
              { loc: [22, 30], note: "Create transformations of PCollections from BigQuery to Dataflow operations"},
              { loc: [46, 53], note: "Querying BigQuery"},
              { loc: [232, 240], note: "Querying BigQuery"},
              { loc: [221, 231], note: "Querying BigQuery"},
              { loc: [54, 55], note: "Transform the result"},
              { loc: [287, 298], note: "Transform and write to file"},
              { loc: [165, 168], note: "PCollection[TableRow] => PCollection[_ <: DeviceId] using PTransform"},
              { loc: [138, 148], note: "Filtering rows and converting them to case classes"},
              { loc: [127, 132], note: "Writing to Google Storage"},
              { loc: [97, 113], note: "Some of the Scala tweaks I had to do"},
              { loc: [114, 127], note: "... and some more"},
              { loc: [251, 278], note: "... and even more"},
            ]}/>

          <Slide transition={["slide"]} bgImage={images.mc.replace("/", "")}>
            <Heading size={1} caps fit textColor="pink" textFont="primary">
              Stop! Demo time
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={1} fit textColor="white" textFont="primary" >
              I want to see something running!
            </Heading>
            {<div>
              <iframe frameBorder="0" src="http://localhost:3000" width="900px" height="550px" seamless></iframe>
            </div>}
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" notes="This is a big verification for us since Spotify is migrating all their systems to GCloud">
            <Image src={images.spotify.replace("/", "")} width={800}/>
            <Text textColor="white" textFont="primary">
              http://spotify.github.io/scio
            </Text>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={2} caps fit textColor="white" textFont="primary">
              Hvis litt Scio kode som kaller Big Huge Thesaurus
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgImage={images.mc.replace("/", "")}>
            <Heading size={1} textColor="pink" textFont="primary">
              Stop! Demo time
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Text textColor="white" textFont="primary" lineHeight={1.5}>
              http://thetwenty.jobs
            </Text>
            {
              <iframe frameBorder="0" src="http://thetwenty.jobs/" width="900px" height="600px" seamless></iframe>
            }
          </Slide>

          <Slide transition={["slide"]} bgImage={images.mc.replace("/", "")}>
            <Heading size={1} caps fit textColor="pink" textFont="primary">
              Takk for meg!!
            </Heading>
          </Slide>
          {/*
            <Slide transition={["slide"]} bgColor="black" notes="You can even put notes on your slide. How awesome is that?">
              <Image src={images.kat.replace("/", "")} margin="0px auto 40px" height="293px"/>
              <Heading size={2} caps fit textColor="primary" textFont="primary">
                Wait what?
                </Heading>
            </Slide>
            <Slide transition={["zoom", "fade"]} bgColor="primary" notes="<ul><li>talk about that</li><li>and that</li></ul>">
            <CodePane
              lang="jsx"
              source={require("raw!../assets/deck.example")}
              margin="20px auto"
            />
          </Slide>
          <Slide transition={["slide"]} bgImage={images.city.replace("/", "")} bgDarken={0.75}>
            <Appear fid="1">
              <Heading size={1} caps fit textColor="primary">
                Full Width
              </Heading>
            </Appear>
            <Appear fid="2">
              <Heading size={1} caps fit textColor="tertiary">
                Adjustable Darkness
              </Heading>
            </Appear>
            <Appear fid="3">
              <Heading size={1} caps fit textColor="primary">
                Background Imagery
              </Heading>
            </Appear>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>Flexible Layouts</Heading>
            <Layout>
              <Fill>
                <Heading size={4} caps textColor="secondary" bgColor="white" margin={10}>
                  Left
                </Heading>
              </Fill>
              <Fill>
                <Heading size={4} caps textColor="secondary" bgColor="white" margin={10}>
                  Right
                </Heading>
              </Fill>
            </Layout>
          </Slide>
          <Slide transition={["slide"]} bgColor="black">
            <BlockQuote>
              <Quote>Wonderfully formatted quotes</Quote>
              <Cite>Ken Wheeler</Cite>
            </BlockQuote>
          </Slide>
          <Slide transition={["spin", "zoom"]} bgColor="tertiary">
            <Heading caps fit size={1} textColor="primary">
              Inline Markdown
            </Heading>
            <Markdown>
              {`
![Markdown Logo](${images.markdown.replace("/", "")})

You can write inline images, [Markdown Links](http://commonmark.org), paragraph text and most other markdown syntax
* Lists too!
* With ~~strikethrough~~ and _italic_
* And lets not forget **bold**
              `}
            </Markdown>
          </Slide>
          <Slide transition={["slide", "spin"]} bgColor="primary">
            <Heading caps fit size={1} textColor="tertiary">
              Smooth
            </Heading>
            <Heading caps fit size={1} textColor="secondary">
              Combinable Transitions
            </Heading>
          </Slide>
          <Slide transition={["fade"]} bgColor="secondary" textColor="primary">
            <List>
              <Appear><ListItem>Inline style based theme system</ListItem></Appear>
              <Appear><ListItem>Autofit text</ListItem></Appear>
              <Appear><ListItem>Flexbox layout system</ListItem></Appear>
              <Appear><ListItem>React-Router navigation</ListItem></Appear>
              <Appear><ListItem>PDF export</ListItem></Appear>
              <Appear><ListItem>And...</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["slide"]} bgColor="primary">
            <Heading size={1} caps fit textColor="tertiary">
              Your presentations are interactive
            </Heading>
            <Interactive/>
          </Slide>
          <Slide transition={["spin", "slide"]} bgColor="tertiary">
            <Heading size={1} caps fit lineHeight={1.5} textColor="primary">
              Made with love in Seattle by
            </Heading>
            <Link href="http://www.formidablelabs.com"><Image width="100%" src={images.logo}/></Link>
          </Slide>*/}
        </Deck>
      </Spectacle>
    );
  }
}
