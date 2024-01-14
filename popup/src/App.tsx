import "./App.css";
import Loader from "./Loader";
import { useChromeContext } from "./ChromeContext";
import DisableApplication from "./DisableApplication";
import { Button, TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import {
  DISABLED_KEYBOARD_SHORTCUT,
  defaultShortcuts,
  keyboardEventToString,
} from "./common/keyboard_shortcuts";

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

function KeyboardPressInput(props: {
  value: string;
  setvalue: (value: string) => void;
  label: string;
  id?: string;
}) {
  const handleCapture = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pressedValue = keyboardEventToString(event);

    props.setvalue(pressedValue);
  };

  return (
    <TextField
      id={props.id}
      size="small"
      label={props.label}
      value={props.value}
      onKeyDown={handleCapture}
      InputProps={{ readOnly: true }}
    />
  );
}

function EditShortcuts(props: { finishedEditing: () => void }) {
  const chromeContext = useChromeContext();
  // const { keyboardShortcuts, setKeyboardShortcuts } = chromeContext;

  const [playPauseShortcut, setPlayPauseShortcut] = useState(
    chromeContext?.keyboardShortcuts.playPause
  );
  const [forwardShortcut, setForwardShortcut] = useState(
    chromeContext?.keyboardShortcuts.forward
  );
  const [backwardShortcut, setBackwardShortcut] = useState(
    chromeContext?.keyboardShortcuts.backward
  );
  const [fullscreenShortcut, setFullscreenShortcut] = useState(
    chromeContext?.keyboardShortcuts.fullscreen
  );
  const [subtitlesShortcut, setSubtitlesShortcut] = useState(
    chromeContext?.keyboardShortcuts.subtitles
  );
  const [increasePlaybackRateShortcut, setIncreasePlaybackRateShortcut] =
    useState(chromeContext?.keyboardShortcuts.increasePlaybackRate);

  const [decreasePlaybackRateShortcut, setDecreasePlaybackRateShortcut] =
    useState(chromeContext?.keyboardShortcuts.decreasePlaybackRate);

  function reset() {
    setPlayPauseShortcut(defaultShortcuts.playPause);
    setForwardShortcut(defaultShortcuts.forward);
    setBackwardShortcut(defaultShortcuts.backward);
    setFullscreenShortcut(defaultShortcuts.fullscreen);
    setSubtitlesShortcut(defaultShortcuts.subtitles);
    setIncreasePlaybackRateShortcut(defaultShortcuts.increasePlaybackRate);
    setDecreasePlaybackRateShortcut(defaultShortcuts.decreasePlaybackRate);
  }

  const [nonUniqueError, setNonUniqueError] = useState(false);

  useEffect(() => {
    const shortcuts = [
      playPauseShortcut,
      forwardShortcut,
      backwardShortcut,
      fullscreenShortcut,
      subtitlesShortcut,
      increasePlaybackRateShortcut,
      decreasePlaybackRateShortcut,
    ];
    const uniqueShortcuts = new Set(shortcuts);
    setNonUniqueError(shortcuts.length !== uniqueShortcuts.size);
  }, [
    playPauseShortcut,
    forwardShortcut,
    backwardShortcut,
    fullscreenShortcut,
    subtitlesShortcut,
    increasePlaybackRateShortcut,
    decreasePlaybackRateShortcut,
  ]);

  if (!chromeContext) {
    return <Loader />;
  }

  function save() {
    chromeContext!.setKeyboardShortcuts({
      playPause: playPauseShortcut!,
      forward: forwardShortcut!,
      backward: backwardShortcut!,
      fullscreen: fullscreenShortcut!,
      subtitles: subtitlesShortcut!,
      increasePlaybackRate: increasePlaybackRateShortcut!,
      decreasePlaybackRate: decreasePlaybackRateShortcut!,
    });
    props.finishedEditing();
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "14em" },
        }}
      >
        <h1 style={{ marginBottom: "0" }}>Editing shortcuts</h1>
        <p
          style={{
            width: "14em",
            display: "inline-block",
            marginBottom: "1em",
            textAlign: "center",
          }}
        >
          To edit a shortcut, click on the text field that you want to edit and
          then press on your keyboard the shortcut combination you want to have.
        </p>
        {nonUniqueError && (
          <p
            className="error"
            style={{
              width: "14em",
              display: "inline-block",
              marginTop: "-0.3em",
              marginBottom: "0.5em",
            }}
          >
            All shortcuts have to be unique
          </p>
        )}
        <div>
          <KeyboardPressInput
            value={playPauseShortcut!}
            setvalue={setPlayPauseShortcut}
            label="Play/Pause"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={forwardShortcut!}
            setvalue={setForwardShortcut}
            label="Forward 5 seconds"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={backwardShortcut!}
            setvalue={setBackwardShortcut}
            label="Backward 5 seconds"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={fullscreenShortcut!}
            setvalue={setFullscreenShortcut}
            label="Enter/Exit Fullscreen"
          />
        </div>
        <div>
          <KeyboardPressInput
            id="toggle-english-subtitles"
            value={subtitlesShortcut!}
            setvalue={setSubtitlesShortcut}
            label="Show/Hide English subtitles"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={increasePlaybackRateShortcut!}
            setvalue={setIncreasePlaybackRateShortcut}
            label="Increase playback rate by 0.5"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={decreasePlaybackRateShortcut!}
            setvalue={setDecreasePlaybackRateShortcut}
            label="Decrease playback rate by 0.5"
          />
        </div>
        <div>
          <Button
            id="save-shortcuts"
            variant="contained"
            onClick={save}
            style={{ marginRight: "1em", width: "6.5em" }}
            disabled={nonUniqueError}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={props.finishedEditing}
            style={{ width: "6.5em" }}
          >
            Cancel
          </Button>
        </div>
        <Button
          type="reset"
          variant="text"
          onClick={reset}
          style={{ marginTop: "0.5em" }}
        >
          Restore defaults
        </Button>
      </Box>
    </>
  );
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
