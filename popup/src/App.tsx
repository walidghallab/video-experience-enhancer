import "./App.css";
import Loader from "./Loader";
import { useChromeContext } from "./ChromeContext";
import DisableApplication from "./DisableApplication";
import { Button } from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { DISABLED_KEYBOARD_SHORTCUT } from "./common/keyboard_shortcuts";
import EditShortcuts from "./EditShortcuts";

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

function TdForShortcutKey({ shortcutKey }: { shortcutKey?: string }) {
  shortcutKey = shortcutKey || DISABLED_KEYBOARD_SHORTCUT;
  return (
    <td
      className={shortcutKey === DISABLED_KEYBOARD_SHORTCUT ? "error-text" : ""}
    >
      {shortcutKey}
    </td>
  );
}

/** SupportedUrl gets displayed when the current url is a website with support for special functionality. */
function SupportedUrl() {
  const shortcuts = useChromeContext()?.keyboardShortcuts;
  return (
    <div>
      We currently support those keys:
      <table className="popup">
        <tbody>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.playPause} />
            <td>Play/Pause</td>
          </tr>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.backward} />
            <td>Backward 5 seconds</td>
          </tr>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.forward} />
            <td>Forward 5 seconds</td>
          </tr>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.fullscreen} />
            <td>Enter/Exit Fullscreen</td>
          </tr>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.subtitles} />
            <td>Show/Hide English subtitles</td>
          </tr>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.increasePlaybackRate} />
            <td>Increase playback rate by 0.5</td>
          </tr>
          <tr>
            <TdForShortcutKey shortcutKey={shortcuts?.decreasePlaybackRate} />
            <td>Decrease playback rate by 0.5</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/** CommonUrl gets displayed when the current url is a website with no special added functionality. */
function CommonUrl() {
  return (
    <div>
      <div className="margin-around-medium">
        We currently support those keyboard shortcuts for this url
        <br />
        (if you focus on a video):
      </div>
      <table className="popup">
        <tbody>
          <tr>
            <td>Ctrl + Up</td>
            <td>Increase playback rate by 0.5</td>
          </tr>
          <tr>
            <td>Ctrl + Down</td>
            <td>Decrease playback rate by 0.5</td>
          </tr>
        </tbody>
      </table>
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
  const [beingEdited, setBeingEdited] = useState(false);
  const url = useChromeContext()?.url;
  if (beingEdited) {
    return (
      <div className="App">
        <EditShortcuts finishedEditing={() => setBeingEdited(false)} />
      </div>
    );
  }

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
        <Button
          id="edit-shortcuts"
          startIcon={<EditIcon />}
          variant="contained"
          onClick={() => setBeingEdited(true)}
        >
          Edit shortcuts
        </Button>
        <FilingRequest />
      </main>
      <footer>{url && <DisableApplication />}</footer>
    </div>
  );
}

export default App;
