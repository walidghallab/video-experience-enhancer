document.querySelectorAll("body")[0].addEventListener("keydown", (e) => {
  if (document.fullscreenElement) {
    video = document.querySelectorAll("video")[0];
    const inc = 5;
    switch (e.key) {
      case "ArrowRight":
        video.currentTime += inc;
        break;
      case "ArrowLeft":
        video.currentTime -= inc;
        break;
      case " ":
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        break;
      case "f":
        if (document.fullscreenElement) {
          document.exitFullscreen();
          e.preventDefault();
        } 
        break;
    }
  }
});
