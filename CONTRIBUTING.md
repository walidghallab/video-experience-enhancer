# Contributing to video-experience-enhancer

Thank you for your interest in contributing to the video-experience-enhancer Chrome extension! We appreciate your help in making this project better.

## Getting Started

To get started with contributing, please follow these steps:

1. Fork the repository.
2. Clone the forked repository to your local machine.
3. Install the chrome extension with your local copy (instructions [here](#installation-from-source-code-for-development)).
4. Make your changes or additions to the codebase.
5. Build your changes using `./build.sh` from the project root directory (this command correctly builds and bundles all the files in production mode and optimizes the build for the best performance).\
To make development easier:
   - In react, there is a mock with `npm start` from `/popup` directory, it supports live updates, check [/popup/README.md](/popup/README.md) for more details.
6. Test your changes to ensure they work as expected.
7. Commit your changes with a descriptive commit message.
8. Push your changes to your forked repository.
9. Open a pull request to the main repository.

## Directory structure

The project follows the following structure:

- **`/src`** directory contains the final chrome extension content.
- **`/test`** directory contains integration tests.
- **`/popup`** directory contains the popup page (that gets displayed when the user click on the extension icon). It only exist for development and get built into `/src` directory by running `npm run build` from `/popup` directory.
- **`/content-scripts`** directory contains the content scripts (that runs when the user opens the specified page). It only exist for development and get built into `/src` directory by running `npm run build` from `/content-scripts` directory.

## Installation from source code (for development)

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

## Code Style

We follow a specific code style in this project to ensure consistency. Please make sure to adhere to the following guidelines:

- Use meaningful variable and function names.
- Write clear and concise comments.
- Format your code using the provided linter configuration.

## Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository. Make sure to provide a detailed description of the problem or suggestion.

## Contributing Guidelines

- Before starting work on a new feature or bug fix, please check the existing issues and pull requests to avoid duplication of effort. Please create a new issue if there is no existing one.
- If you plan to work on an existing issue, please comment on the issue to let others know that you are working on it.
- When submitting a pull request, make sure to provide a clear description of the changes made and reference any related issues.

## Code of Conduct

Please note that by contributing to this project, you are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful and considerate towards others and their ideas.

## License

By contributing to this project, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).

We appreciate your contributions and look forward to your involvement in making the video-experience-enhancer Chrome extension even better!
