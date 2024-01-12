(function () {
  chrome.storage.sync.get(["disabled"], function ({ disabled }) {
    // We are adding event listener to the body element as the video element is keep getting out of focus in full screen mode
    if (!disabled) {
      document.querySelector("body").addEventListener("keydown", handleKeyDown);
    }
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      if (changes.disabled) {
        if (changes.disabled.newValue) {
          document
            .querySelector("body")
            .removeEventListener("keydown", handleKeyDown);
        } else {
          document
            .querySelector("body")
            .addEventListener("keydown", handleKeyDown);
        }
      }
    });
  });

  function handleKeyDown(e: KeyboardEvent) {
    const video = document.querySelector("video");
    if (!video) {
      return;
    }

    // Functionality for both fullscreen and non-fullscreen modes as long as the focused element is the video or an ancestor of the video.
    if (
      document.activeElement == video ||
      document.activeElement.querySelector("video")
    ) {
      switch (e.key) {
        case "c":
        case "C":
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
      switch (e.key) {
        case "ArrowRight":
          video.currentTime += inc;
          break;
        case "ArrowLeft":
          video.currentTime -= inc;
          break;
        case " ": // Space
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          e.preventDefault();
          break;
        case "f":
        case "F":
          // We are already in full screen mode, so exit it.
          document.exitFullscreen();
          e.preventDefault();
          break;
      }
    }
  }
})();
