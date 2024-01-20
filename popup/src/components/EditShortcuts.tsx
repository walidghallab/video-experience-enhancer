import { useEffect, useState } from "react";
import { useChromeContext } from "../contexts/ChromeContext";
import {
  DEFAULT_SHORTCUTS,
  INVALID_KEYBOARD_SHORTCUT,
  KeyboardShortcuts,
} from "../common/keyboard_shortcuts";
import Loader from "./Loader";
import { Box, Button } from "@mui/material";
import KeyboardPressInput from "./KeyboardPressInput";

const SECOND = 1000;
export const WAITING_TIME_TO_SHOW_INVALID_ERROR = 1 * SECOND;

function EditShortcuts(props: { finishedEditing: () => void }) {
  const chromeContext = useChromeContext();

  const [keyboardShortcuts, setKeyboardShortcuts] = useState<KeyboardShortcuts>(
    chromeContext?.keyboardShortcuts || DEFAULT_SHORTCUTS
  );

  function updateLocalState(shortcuts: Partial<KeyboardShortcuts>) {
    setKeyboardShortcuts({ ...keyboardShortcuts, ...shortcuts });
  }

  function reset() {
    setKeyboardShortcuts({ ...DEFAULT_SHORTCUTS });
  }

  const [nonUniqueError, setNonUniqueError] = useState(false);
  const [invalidControlError, setInvalidControlError] = useState(false);

  // We delay showing invalid control error to avoid showing it when the user is still typing
  const [showInvalidControlError, setShowInvalidControlError] = useState(false);

  useEffect(() => {
    // When it is invalid, we show the error after 1 second, otherwise we update it immediately.
    if (invalidControlError) {
      const timeout = setTimeout(
        () => setShowInvalidControlError(invalidControlError), // We use most recent value of invalidControlError in case it has changed.
        WAITING_TIME_TO_SHOW_INVALID_ERROR
      );
      return () => clearTimeout(timeout);
    } else {
      setShowInvalidControlError(false);
    }
  }, [invalidControlError]);

  useEffect(() => {
    if (chromeContext) {
      setKeyboardShortcuts({ ...chromeContext.keyboardShortcuts });
    }
  }, [chromeContext]);

  useEffect(() => {
    const shortcuts = [...Object.values(keyboardShortcuts)];
    const uniqueShortcuts = new Set(shortcuts);
    setNonUniqueError(shortcuts.length !== uniqueShortcuts.size);
    setInvalidControlError(uniqueShortcuts.has(INVALID_KEYBOARD_SHORTCUT));
  }, [keyboardShortcuts]);

  if (!chromeContext) {
    return <Loader />;
  }

  function save() {
    chromeContext!.setKeyboardShortcuts({ ...keyboardShortcuts });
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
        {showInvalidControlError && (
          <p
            className="error"
            style={{
              width: "14em",
              display: "inline-block",
              marginTop: "-0.3em",
              marginBottom: "0.5em",
            }}
          >
            All shortcuts have to be valid
          </p>
        )}
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.playPause}
            setvalue={(v) => updateLocalState({ playPause: v })}
            label="Play/Pause"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.forward}
            setvalue={(v) => updateLocalState({ forward: v })}
            label="Forward 5 seconds"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.backward}
            setvalue={(v) => updateLocalState({ backward: v })}
            label="Backward 5 seconds"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.fullscreen}
            setvalue={(v) => updateLocalState({ fullscreen: v })}
            label="Enter/Exit Fullscreen"
          />
        </div>
        <div>
          <KeyboardPressInput
            id="toggle-english-subtitles"
            value={keyboardShortcuts.subtitles}
            setvalue={(v) => updateLocalState({ subtitles: v })}
            label="Show/Hide English subtitles"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.increasePlaybackRate}
            setvalue={(e) => updateLocalState({ increasePlaybackRate: e })}
            label="Increase playback rate by 0.5"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.decreasePlaybackRate}
            setvalue={(e) => updateLocalState({ decreasePlaybackRate: e })}
            label="Decrease playback rate by 0.5"
          />
        </div>
        <div>
          <KeyboardPressInput
            value={keyboardShortcuts.downloadVideo}
            setvalue={(e) => updateLocalState({ downloadVideo: e })}
            label="Download video"
          />
        </div>
        <div>
          <Button
            id="save-shortcuts"
            variant="contained"
            onClick={save}
            style={{ marginRight: "1em", width: "6.5em" }}
            disabled={nonUniqueError || invalidControlError}
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

export default EditShortcuts;
