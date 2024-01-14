import { keyboardEventToString } from "../popup/src/common/keyboard_shortcuts";
import { LiveProxyStorage, executeKeyboardEventListener } from "./utils";

// The handler here stops propagation and prevents default for all keydown events, that's why we delay adding its eventListener to allow other scripts to run first.
setTimeout(() => {
  executeKeyboardEventListener(handleKeyDown);
});

function handleKeyDown(e: KeyboardEvent, liveProxyStorage: LiveProxyStorage) {
  const video = document.querySelector("video");
  if (!video) {
    return;
  }

  const keyboardShortcuts = liveProxyStorage.keyboardShortcuts;
  const currentPress = keyboardEventToString(e);
  e.stopImmediatePropagation();
  e.preventDefault();

  // Functionality for both fullscreen and non-fullscreen modes as long as the focused element is the video or an ancestor of the video.
  if (
    document.activeElement == video ||
    document.activeElement?.querySelector("video")
  ) {
    const inc = 5;
    switch (currentPress) {
      case keyboardShortcuts.subtitles:
        const textTracks = video.textTracks;
        if (!textTracks || textTracks.length === 0) {
          break;
        }
        const englishTrack = Array.from(textTracks).find(
          (e) => e.language === "en"
        );
        if (!englishTrack) {
          break;
        }
        if (englishTrack.mode === "showing") {
          englishTrack.mode = "disabled";
        } else {
          englishTrack.mode = "showing";
        }
        break;

      case keyboardShortcuts.forward:
        video.currentTime += inc;
        break;

      case keyboardShortcuts.backward:
        video.currentTime -= inc;
        break;

      case keyboardShortcuts.playPause:
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        break;

      case keyboardShortcuts.fullscreen:
        const fullscreenButton: HTMLElement | null = document.fullscreenElement
          ? document.querySelector("button[aria-label='Exit full Screen']")
          : document.querySelector("button[aria-label='Full Screen']");
        if (fullscreenButton) {
          fullscreenButton.click();
        } else {
          console.error("Could not find fullscreen button");
        }
        break;
    }
  }
}
