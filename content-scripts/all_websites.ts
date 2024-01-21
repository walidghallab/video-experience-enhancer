import { keyboardEventToString } from "../popup/src/common/keyboard_shortcuts";
import { LiveProxyStorage, downloadVideo, executeKeyboardEventListener, insertSnackbar, showSnackbar } from "./utils";

executeKeyboardEventListener(handleKeyDown);

insertSnackbar();

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
      case keyboardShortcuts.increasePlaybackRate:
        if (video.playbackRate < 16) {
          video.playbackRate += 0.5;
        }
        showSnackbar(`Set playback rate to ${video.playbackRate}x`);
        e.preventDefault();
        break;
      case keyboardShortcuts.decreasePlaybackRate:
        if (video.playbackRate > 0.5) {
          video.playbackRate -= 0.5;
        }
        showSnackbar(`Set playback rate to ${video.playbackRate}x`);
        e.preventDefault();
        break;
      case keyboardShortcuts.downloadVideo:
        downloadVideo(video.src, document.title);
        e.preventDefault();
        break;
    }
  }
}
