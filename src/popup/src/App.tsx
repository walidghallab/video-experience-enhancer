import "./App.css";
import Loader from "./Loader";
import { useChromeContext } from "./ChromeContext";

const supportedUrlsRegex = ["https://(.*.)?coursera.org/.*"].map(
  (url) => new RegExp(url)
);

function HeaderTitle() {
  return <h1>Welcome to video experience enhancer</h1>;
}

function FilingRequest() {
  return (
    <p>
      <span className="colorful">
        If you have any new functionality that you want to see on this website
        or any others,
        <em>
          please submit a feature request on
          <a
            href="https://github.com/walidghallab/video-experience-enhancer?tab=readme-ov-file#feature-requests"
            aria-label="Link to file a feature request."
            target="_blank"
            rel="noreferrer"
          >
            our GitHub page
          </a>
        </em>
      </span>
    </p>
  );
}

/** SupportedWebsite gets displayed when the current url is a website with support for special functionality. */
function SupportedWebsite() {
  return (
    <>
      <div>
        We currently support those keys:
        <dl>
          <dt>Space</dt>
          <dd>Play/Pause</dd>

          <dt>Left</dt>
          <dd>Backward 5 seconds</dd>

          <dt>Right</dt>
          <dd>Forward 5 seconds</dd>

          <dt>F or f</dt>
          <dd>Enter/Exit Fullscreen</dd>

          <dt>C or c</dt>
          <dd>Show/Hide English subtitles</dd>
        </dl>
      </div>
      <FilingRequest />
    </>
  );
}

/** UnsupportedWebsite gets displayed when the current url is a website with no supported functionality. */
function UnsupportedWebsite() {
  return (
    <>
      <p>Functionality on this website already works out of the box.</p>
      <FilingRequest />
    </>
  );
}

function isSupportedDomain(url: string) {
  return supportedUrlsRegex.some((urlRegex) => url.match(urlRegex));
}

function App() {
  const url = useChromeContext()?.url;

  let componentToRender = <Loader />;

  if (url) {
    if (isSupportedDomain(url)) {
      componentToRender = <SupportedWebsite />;
    } else {
      componentToRender = <UnsupportedWebsite />;
    }
  }

  return (
    <div className="App">
      <header>
        <HeaderTitle />
      </header>
      <main>{componentToRender}</main>
    </div>
  );
}

export default App;
