import { render, screen } from "@testing-library/react";
import App from "./App";
import ChromeContextProvider from "./ChromeContext";

const SUPPORTED_WEBSITE = { url: "https://coursera.org/" };
const UNSUPPORTED_WEBSITE = { url: "https://example.org/" };

describe.each([
  ["supported websites", SUPPORTED_WEBSITE],
  ["unsupported websites", UNSUPPORTED_WEBSITE],
])("for %s", (name, mockValue) => {
  it("renders welcome text", () => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );
    const headerText = screen.getByText(
      /Welcome to video experience enhancer/i
    );
    expect(headerText).toBeInTheDocument();
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
});

describe("for supported websites", () => {
  it("renders correct text for supported websites", async () => {
    render(
      <ChromeContextProvider mockValue={SUPPORTED_WEBSITE}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(/We currently support those keys/i);
  });
});

describe("for unsupported websites", () => {
  it("renders welcome text", () => {
    render(
      <ChromeContextProvider mockValue={UNSUPPORTED_WEBSITE}>
        <App />
      </ChromeContextProvider>
    );
    const headerText = screen.getByText(
      /Welcome to video experience enhancer/i
    );
    expect(headerText).toBeInTheDocument();
  });
});
