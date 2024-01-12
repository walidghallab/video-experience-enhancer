(function () {
  chrome.storage.sync.get(["disabled"], function ({ disabled }) {
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
      // Functionality with Ctrl key.
      if (e.ctrlKey) {
        switch (e.key) {
          case "ArrowUp":
            video.playbackRate += 0.5;
            e.preventDefault();
            break;
          case "ArrowDown":
            if (video.playbackRate > 0.5) {
              video.playbackRate -= 0.5;
            }
            e.preventDefault();
            break;
        }
      }
    }
  }
})();
