import { render, screen } from "@testing-library/react";
import App from "./App";
import ChromeContextProvider from "./ChromeContext";

describe("for supported websites", () => {
  const mockValue = { url: "https://coursera.org/" };

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

  it("renders correct text for supported websites", async () => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(/We currently support those keys/i);
  });
});

describe("for unsupported websites", () => {
  const mockValue = { url: "https://example.org/" };

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
  
  it("renders correct text for unsupported websites", async () => {
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <App />
      </ChromeContextProvider>
    );
    await screen.findByText(
      /Functionality on this website already works out of the box/i
    );
  });
});