import {
  DEFAULT_SHORTCUTS,
  exportedForTesting,
  keyboardEventToString,
  keyboardShortcutsFromUnknown,
} from "./keyboard_shortcuts";

describe("keyboardEventToString function", () => {
  it.each([
    {
      name: "pressing 'a'",
      event: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: "a",
      },
      expected: "A",
    },
    {
      name: "pressing 'A'",
      event: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: "A",
      },
      expected: "A",
    },
    {
      name: "pressing 'a' with Ctrl",
      event: {
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: "a",
      },
      expected: "Ctrl + A",
    },
    {
      name: "pressing 'a' with Ctrl and Alt",
      event: {
        ctrlKey: true,
        shiftKey: false,
        altKey: true,
        metaKey: false,
        code: "a",
      },
      expected: "Ctrl + Alt + A",
    },
    {
      name: "pressing 'a' with all modifiers",
      event: {
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true,
        code: "a",
      },
      expected: "Ctrl + Alt + Meta + Shift + A",
    },
    {
      name: "not pressing any key",
      event: {
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        code: "",
      },
      expected: "",
    },
  ])("returns the appropriate string for $name", ({ event, expected }) => {
    expect(keyboardEventToString(event)).toBe(expected);
  });
});

describe("keyboardShortcutsFromUnknown function", () => {
  it.each([
    {
      description: "returns the default shortcuts when given an empty object",
      input: {},
      expected: DEFAULT_SHORTCUTS,
      expectedToThrow: false,
    },
    {
      description:
        "returns the default shortcuts when given an undefined value",
      input: undefined,
      expected: DEFAULT_SHORTCUTS,
      expectedToThrow: false,
    },
    {
      description: "returns the correct value when given a valid object",
      input: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        backward: "Alt + ArrowLeft",
        fullscreen: "Alt + F",
        subtitles: "Alt + C",
        increasePlaybackRate: "Alt + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
        downloadVideo: "Ctrl + Shift + D",
      },
      expected: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        backward: "Alt + ArrowLeft",
        fullscreen: "Alt + F",
        subtitles: "Alt + C",
        increasePlaybackRate: "Alt + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
        downloadVideo: "Ctrl + Shift + D",
      },
      expectedToThrow: false,
    },
    {
      description:
        "returns the correct value when given a valid object with some missing values",
      input: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        decreasePlaybackRate: "Alt +  ArrowDown",
      },
      expected: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        backward: "ArrowLeft",
        fullscreen: "F",
        subtitles: "C",
        increasePlaybackRate: "Ctrl + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
        downloadVideo: "Alt + Shift + D",
      },
      expectedToThrow: false,
    },
    {
      description:
        "returns the correct value when given a valid object with some invalid values",
      input: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        decreasePlaybackRate: "Alt +  ArrowDown",
        invalid: "invalid",
      },
      expected: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        backward: "ArrowLeft",
        fullscreen: "F",
        subtitles: "C",
        increasePlaybackRate: "Ctrl + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
        downloadVideo: "Alt + Shift + D",
      },
      expectedToThrow: false,
    },
    {
      description: "returns the correct value when given a invalid object",
      input: {
        playPause: 2,
        forward: "Alt + ArrowRight",
        decreasePlaybackRate: "Alt +  ArrowDown",
      },
      expectedToThrow: true,
    },
  ])("$description", ({ input, expected, expectedToThrow }) => {
    if (expectedToThrow) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(() => keyboardShortcutsFromUnknown(input)).toThrowError();
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(keyboardShortcutsFromUnknown(input)).toEqual(expected);
    }
  });
});

describe ("normalizeShortcut function", () => {
  it ("returns the correct value when given a valid shortcut", () => {
    expect(exportedForTesting.normalizeShortcut("Ctrl + A")).toBe("Ctrl + A");
  });

  it ("returns the correct value when given a shortcut stored in old way", () => {
    expect(exportedForTesting.normalizeShortcut("Ctrl + A/a")).toBe("Ctrl + A");
  });
});