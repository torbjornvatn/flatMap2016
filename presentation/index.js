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
  tre_musketerer: require("../assets/tre_musketerer.jpg"),
  logo: require("../assets/unacast_logo.png"),
  mc: require("../assets/mc.gif")
};

preloader(images);

const theme = createTheme({
  primary: "#ff4081"
}, {
  // primary: "Roboto"
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

          <Slide transition={["slide"]} bgImage={images.tre_musketerer.replace("/", "")} bgDarken={0.50}>
            <Heading size={2} caps fit textColor="white" textFont="primary">
              Who is Unacast?
            </Heading>
            <Heading size={2} caps fit textColor="white" textFont="primary">
              What are we trying to do?
            </Heading>
          </Slide>

          <Slide transition={["slide"]}>
              <Image class="shadow" src={images.whowhat1.replace("/", "")} fit margin="0px auto 0px" height="50%"/>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={2} caps fit textColor="white" textFont="primary">
              How do our architecture work? x number of slides
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={2} caps fit textColor="white" textFont="primary">
              How do Honeybatcher work? x number of slides
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={2} caps fit textColor="white" textFont="primary">
              vise de ulike tilpassningene jeg har gjort for å få Dataflow til å funke i Scala
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgImage={images.mc.replace("/", "")}>
            <Heading size={1} caps fit textColor="pink" textFont="primary">
              Stop! Demo time
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={2} caps fit textColor="white" textFont="primary">
              Enter Scio from Spotify
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgColor="primary" >
            <Heading size={2} caps fit textColor="white" textFont="primary">
              Hvis litt Scio kode som kaller Big Huge Thesaurus
            </Heading>
          </Slide>

          <Slide transition={["slide"]} bgImage={images.mc.replace("/", "")}>
            <Heading size={1} caps fit textColor="pink" textFont="primary">
              Stop! Demo time
            </Heading>
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
