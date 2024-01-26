import { render, screen } from "@testing-library/react";
import ChromeContextProvider, { useChromeContext } from "./ChromeContext";
import chrome from "sinon-chrome";
import { KeyboardShortcuts } from "../common/keyboard_shortcuts";
import { act } from "react-dom/test-utils";

describe("ChromeContextProvider", () => {
  beforeAll(() => {
    global.chrome = chrome as any;
  });

  let storageSetters = {
    setDisabled: (disabled: boolean) => {},
    setKeyboardShortcuts: (shortcuts: KeyboardShortcuts) => {},
  };

  function TestComponent() {
    const context = useChromeContext()!;

    storageSetters.setDisabled = context.setDisabled;
    storageSetters.setKeyboardShortcuts = context.setKeyboardShortcuts;

    return (
      <div>
        <div>Url: {context.url}</div>
        <div>Disabled: {context.disabled.toString()}</div>
        <div>
          KeyboardShortcuts: {JSON.stringify(context.keyboardShortcuts)}
        </div>
      </div>
    );
  }

  it("provides the ChromeContext correctly", async () => {
    chrome.tabs.query.yields([{ url: "test-url" }]);
    chrome.storage.sync.get.yields({
      disabled: true,
      keyboardShortcuts: {
        playPause: "Alt + Space",
        backward: "Alt + ArrowLeft",
        forward: "Alt + ArrowRight",
        fullscreen: "Alt + F",
        subtitles: "Alt + C/c", // Testing for backward compatibility (check normalizeShortcut function for details).
        increasePlaybackRate: "Alt + ArrowUp",
        decreasePlaybackRate: "Alt + ArrowDown",
      },
    });
    render(
      <ChromeContextProvider>
        <TestComponent />
      </ChromeContextProvider>
    );
    await screen.findByText(/Disabled: true/);
    await screen.findByText(/Url: test-url/);
    await screen.findByText(/"playPause":"Alt \+ Space"/);
    await screen.findByText(/"backward":"Alt \+ ArrowLeft"/);
    await screen.findByText(/"forward":"Alt \+ ArrowRight"/);
    await screen.findByText(/"fullscreen":"Alt \+ F"/);
    await screen.findByText(/"subtitles":"Alt \+ C"/);
    await screen.findByText(/"increasePlaybackRate":"Alt \+ ArrowUp"/);
    await screen.findByText(/"decreasePlaybackRate":"Alt \+ ArrowDown"/);
  });

  it("sets the disabled state correctly", async () => {
    render(
      <ChromeContextProvider>
        <TestComponent />
      </ChromeContextProvider>
    );

    act(() => {
      storageSetters.setDisabled(true);
    });
    await screen.findByText(/Disabled: true/);
  });

  it("sets the keyboard shortcuts correctly", async () => {
    render(
      <ChromeContextProvider>
        <TestComponent />
      </ChromeContextProvider>
    );

    act(() => {
      storageSetters.setKeyboardShortcuts({
        playPause: "Alt + Space",
        backward: "Alt + ArrowLeft",
        forward: "Alt + ArrowRight",
        fullscreen: "Alt + F/f",
        subtitles: "Alt + C/c",
        increasePlaybackRate: "Alt + ArrowUp",
        decreasePlaybackRate: "Alt + ArrowDown",
        downloadVideo: "Alt + D/d",
      });
    });
    await screen.findByText(/"playPause":"Alt \+ Space"/);
    await screen.findByText(/"backward":"Alt \+ ArrowLeft"/);
    await screen.findByText(/"forward":"Alt \+ ArrowRight"/);
    await screen.findByText(/"fullscreen":"Alt \+ F\/f"/);
    await screen.findByText(/"subtitles":"Alt \+ C\/c"/);
    await screen.findByText(/"increasePlaybackRate":"Alt \+ ArrowUp"/);
    await screen.findByText(/"decreasePlaybackRate":"Alt \+ ArrowDown"/);
    await screen.findByText(/"downloadVideo":"Alt \+ D\/d"/);
  });
});
