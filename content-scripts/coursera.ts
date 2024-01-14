import { keyboardEventToString } from "../popup/src/common/keyboard_shortcuts";
import { LiveProxyStorage, executeKeyboardEventListener } from "./utils";

executeKeyboardEventListener(handleKeyDown);

function handleKeyDown(e: KeyboardEvent, liveProxyStorage: LiveProxyStorage) {
  const video = document.querySelector("video");
  if (!video) {
    return;
  }

  const keyboardShortcuts = liveProxyStorage.keyboardShortcuts;
  const currentPress = keyboardEventToString(e);

  // Functionality for both fullscreen and non-fullscreen modes as long as the focused element is the video or an ancestor of the video.
  if (
    document.activeElement == video ||
    document.activeElement?.querySelector("video")
  ) {
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

        e.preventDefault();
        break;
    }
  }

  // Functionality for fullscreen mode only (as they are already working in non-fullscreen mode).
  if (document.fullscreenElement) {
    const inc = 5;
    switch (currentPress) {
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
        e.preventDefault();
        break;
      case keyboardShortcuts.fullscreen:
        // We are already in full screen mode, so exit it.
        document.exitFullscreen();
        e.preventDefault();
        break;
    }
  }
}
