// We are adding event listener to the body element as the video element is keep getting out of focus in full screen mode
document.querySelector("body").addEventListener("keydown", (e) => {
  // We don't do anything if we are not in fullscreen as it is already working correctly.
  if (document.fullscreenElement) {
    video = document.querySelector("video");
    if (!video) {
      return;
    }
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
});
