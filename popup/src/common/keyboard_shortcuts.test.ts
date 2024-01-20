import {
  DEFAULT_SHORTCUTS,
  keyboardEventToString,
  keyboardShortcutsFromUnknown,
} from "./keyboard_shortcuts";

describe("keyboardEventToString method", () => {
  it.each([
    {
      name: "pressing 'a'",
      event: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        key: "a",
      },
      expected: "A/a",
    },
    {
      name: "pressing 'A'",
      event: {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        key: "A",
      },
      expected: "A/a",
    },
    {
      name: "pressing 'a' with Ctrl",
      event: {
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        key: "a",
      },
      expected: "Ctrl + A/a",
    },
    {
      name: "pressing 'a' with Ctrl and Alt",
      event: {
        ctrlKey: true,
        shiftKey: false,
        altKey: true,
        metaKey: false,
        key: "a",
      },
      expected: "Ctrl + Alt + A/a",
    },
    {
      name: "pressing 'a' with all modifiers",
      event: {
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true,
        key: "a",
      },
      expected: "Ctrl + Alt + Meta + Shift + A/a",
    },
    {
      name: "not pressing any key",
      event: {
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        key: "",
      },
      expected: "",
    },
  ])("returns the appropriate string for $name", ({ event, expected }) => {
    expect(keyboardEventToString(event)).toBe(expected);
  });
});

describe("keyboardShortcutsFromUnknown method", () => {
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
        fullscreen: "Alt + F/f",
        subtitles: "Alt + C/c",
        increasePlaybackRate: "Alt + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
      },
      expected: {
        playPause: "Alt + Space",
        forward: "Alt + ArrowRight",
        backward: "Alt + ArrowLeft",
        fullscreen: "Alt + F/f",
        subtitles: "Alt + C/c",
        increasePlaybackRate: "Alt + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
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
        fullscreen: "F/f",
        subtitles: "C/c",
        increasePlaybackRate: "Ctrl + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
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
        fullscreen: "F/f",
        subtitles: "C/c",
        increasePlaybackRate: "Ctrl + ArrowUp",
        decreasePlaybackRate: "Alt +  ArrowDown",
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
