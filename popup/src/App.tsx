import "./App.css";
import Loader from "./Loader";
import { useChromeContext } from "./ChromeContext";
import DisableApplication from "./DisableApplication";

const supportedUrlsRegex = ["https://(.*.)?coursera.org/.*"].map(
  (url) => new RegExp(url)
);

function HeaderTitle() {
  return <h1>Welcome to video experience enhancer</h1>;
}

function FilingRequest() {
  return (
    <p>
      <span className="colorful margin-around-medium">
        If you have any new functionality that you want to see on this website
        or any others,
        <em>
          please submit a feature request on&nbsp;
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

/** SupportedUrl gets displayed when the current url is a website with support for special functionality. */
function SupportedUrl() {
  return (
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

        <dt>Ctrl + Up</dt>
        <dd>Increase playback rate by 0.5</dd>

        <dt>Ctrl + Down</dt>
        <dd>Decrease playback rate by 0.5</dd>
      </dl>
    </div>
  );
}

/** CommonUrl gets displayed when the current url is a website with no special added functionality. */
function CommonUrl() {
  return (
    <div>
      <p className="margin-around-medium`">
        We currently support those keys for this url (if you focus on a video):
      </p>
      <dl>
        <dt>Ctrl + Up</dt>
        <dd>Increase playback rate by 0.5</dd>

        <dt>Ctrl + Down</dt>
        <dd>Decrease playback rate by 0.5</dd>
      </dl>
    </div>
  );
}

function UnsupportedUrl() {
  return <p>Nothing to do on the current url &#128513;</p>;
}

function isSupportedDomain(url: string) {
  return supportedUrlsRegex.some((urlRegex) => url.match(urlRegex));
}

function App() {
  const url = useChromeContext()?.url;

  let componentToRender = <Loader />;

  if (url) {
    if (!url.startsWith("http")) {
      componentToRender = <UnsupportedUrl />;
    } else if (isSupportedDomain(url)) {
      componentToRender = <SupportedUrl />;
    } else {
      componentToRender = <CommonUrl />;
    }
  }

  return (
    <div className="App">
      <header>
        <HeaderTitle />
      </header>
      <main>
        {componentToRender}
        <FilingRequest />
      </main>
      <footer>{url && <DisableApplication />}</footer>
    </div>
  );
}

export default App;
