# Contributing to video-experience-enhancer

Thank you for your interest in contributing to the video-experience-enhancer Chrome extension! We appreciate your help in making this project better.

## Getting Started

To get started with contributing, please follow these steps:

1. Fork the repository.
2. Clone the forked repository to your local machine.
3. Install the chrome extension with your local copy (instructions [here](#installation-from-source-code-for-development)).
4. Make your changes or additions to the codebase.
5. Build your changes using `make` from the project root directory (this command correctly builds and bundles all the files in production mode and optimizes the build for the best performance). See some useful tips to make development easier in the [useful notes](#useful-notes) section.
6. Test your changes to ensure they work as expected.
7. Commit your changes with a descriptive commit message.
8. Push your changes to your forked repository.
9. Open a pull request to the main repository.

## Directory structure

The project follows the following structure:

- **`/src`** directory contains the final chrome extension content.
- **`/integration-tests`** directory contains integration tests.
- **`/popup`** directory contains the popup page (that gets displayed when the user click on the extension icon). It only exist for development and get built into `/src/popup` directory by running `make build-popup` from the project root directory.
- **`/content-scripts`** directory contains the content scripts (that runs when the user opens the specified page). It only exist for development and get built into `/src/content-scripts` directory by running `make build-content-scripts` from the project root directory.
- **`/hack`** directory contains scripts used by the repository admins.

## Installation from source code (for development)

To install the extension from the source code, follow these steps:

1. Run this command to clone the repository and build the necessary files (**if you want to use your local version, only run `make` and skip the rest**).

```bash
npm -v > /dev/null &&
git clone https://github.com/walidghallab/video-experience-enhancer &&
cd video-experience-enhancer &&
make
```

2. Open the Chrome browser and go to `chrome://extensions`.
3. Enable the "Developer mode" toggle switch.
4. Click on the "Load unpacked" button and select `src` directory from the cloned repository folder.
5. The extension will be installed and ready to use.

Note that if you install it this way, it will get automatically removed every time you relaunch chrome. This way of installation is listed only for development purposes.

## Useful notes

- In react, there is a mock with `npm start` from `/popup` directory, it supports live updates, check `npm start` documentation in [/popup/README.md](/popup/README.md#npm-start) for more details.
- Makefile was made in order to makes commands run much faster by only rerunning parts that have changed and also simplifies commands. Examples (must be ran from the project root directory):
  - `make` or `make build`: Builds all the code into production optimized code that exist in `/src` directory.
  - `make build-popup`: Builds only code inside `/popup` directory into production optimized code that exist in `/src/popup` directory.
  - `make build-content-scripts`: Builds only code inside `/content-scripts` directory into production optimized code that exist in `/src/content-scripts` directory.
  - `make test`: Runs all tests (including both unit tests and integration tests) in the project.
  - `make integration-tests`: Runs only integration tests in the project.
  - `make unit-tests`: Runs only unit tests in the project. A few notes if you are developing inside `/popup` directory:
    - You can run `npm test` from there to run tests with --watch 
    - You can debug them using `npm run test:debug`, instructions are [here](https://create-react-app.dev/docs/debugging-tests/).
    - You can print test coverage report using `npm run test:coverage`

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
