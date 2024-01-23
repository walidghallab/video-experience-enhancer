import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import ChromeContextProvider, {
  ChromeContextProps,
} from "./contexts/ChromeContext";
import { getMockValueForChromeContextProps } from "./test-helpers/ChromeContextProps.mock";

function newMockForUrl(url: string): ChromeContextProps {
  return {
    ...getMockValueForChromeContextProps(),
    url,
  };
}

const FULLY_SUPPORTED_WEBSITE = newMockForUrl("https://coursera.org/");
const PARTIALLY_SUPPORTED_WEBSITE = newMockForUrl("https://example.org/");
const UNSUPPORTED_WEBSITE = newMockForUrl("ftp://example.org/");

describe.each([
  ["fully supported websites", FULLY_SUPPORTED_WEBSITE],
  ["partially websites", PARTIALLY_SUPPORTED_WEBSITE],
  ["unsupported websites", UNSUPPORTED_WEBSITE],
])("for %s", (name, mockValue) => {
  it("renders header text", async () => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(/Video experience enhancer/i);
  });

  it("renders filing request text", async () => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(
      /If you have any new functionality that you want to see on this website/i
    );
  });

  it("renders edit form when editing", async () => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );

    fireEvent.click(await screen.findByText(/Edit shortcuts/i));
    screen.getByText(/To edit a shortcut/i); // Throws an error if not found.

    fireEvent.click(await screen.findByText(/Cancel/i));
    expect(screen.queryByText(/To edit a shortcut/i)).toBeNull();
  });

  it('renders disable extension button correctly', async() => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );

    await screen.findByText(/Extension is enabled/i);

    fireEvent.click(await screen.findByTestId("toggle-disable"));
    
    await screen.findByText(/Extension is disabled/i);
  });
});

describe("for fully supported websites", () => {
  it("renders correct text", async () => {
    render(
      <ChromeContextProvider mockValue={FULLY_SUPPORTED_WEBSITE}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(/Increase playback rate by 0.5/i);
    await screen.findByText(/Show\/Hide English subtitles/i);
  });
});

describe("for partially supported websites", () => {
  it("renders correct text", async () => {
    render(
      <ChromeContextProvider mockValue={PARTIALLY_SUPPORTED_WEBSITE}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(/Increase playback rate by 0.5/i);
  });
});

describe("for unsupported websites", () => {
  it("renders correct text", async () => {
    render(
      <ChromeContextProvider mockValue={UNSUPPORTED_WEBSITE}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(/Nothing to do on the current url/i);
  });
});
