# Video experience enhancer (Chrome Extension)

This project is a Chrome extension that provides additional functionality for video players played in the web.

## Installation

### From Chrome web store (recommended)

You can install the latest published release from the [Chrome web store](https://chromewebstore.google.com/detail/video-experience-enhancer/gpgijjcmnjpbdpaijihbchgdeencehng?hl=en)

### From source code (for development)

To install the extension from the source code, follow these steps:

1. Run this command to clone the repository and build the necessary files.

```bash
npm -v > /dev/null &&
git clone https://github.com/walidghallab/video-experience-enhancer && 
cd video-experience-enhancer/popup &&
npm install &&
npm run build &&
cd ..
```
2. Open the Chrome browser and go to `chrome://extensions`.
3. Enable the "Developer mode" toggle switch.
4. Click on the "Load unpacked" button and select `src` directory from the cloned repository folder.
5. The extension will be installed and ready to use.

Note that if you install it this way, it will get automatically removed every time you relaunch chrome. This way of installation is listed only for development purposes.

## Usage

Once the extension is installed, you can use it by following these steps:

1. Open the Chrome browser.
2. Open a video in one of the supported websites.
3. Click on the extension icon in the toolbar to check the supported functionality.
4. Try any of the functionality provided.

## Supported websites

Current supported web pages are:

- [coursera.org](https://www.coursera.org/)

For adding more functionality or websites, please submit [feature requests](#feature-requests).

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.

## Feature Requests

If you have any feature requests or ideas for improving the extension, please [file an issue](https://github.com/walidghallab/video-experience-enhancer/issues) on GitHub.
