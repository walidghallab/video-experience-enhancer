import { useEffect, useState } from "react";
import { useChromeContext } from "../contexts/ChromeContext";
import { defaultShortcuts } from "../common/keyboard_shortcuts";
import Loader from "./Loader";
import { Box, Button } from "@mui/material";
import KeyboardPressInput from "./KeyboardPressInput";

function EditShortcuts(props: { finishedEditing: () => void }) {
  const chromeContext = useChromeContext();

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

export default EditShortcuts;