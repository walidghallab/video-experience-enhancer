import { z } from "zod";

export const DISABLED_KEYBOARD_SHORTCUT = "DISABLED";
export const INVALID_KEYBOARD_SHORTCUT = "";

export const KeyboardShortcutStorageKey = "keyboardShortcuts";

const keyboardShortcutsSchema = z.object({
  playPause: z.string(),
  forward: z.string(),
  backward: z.string(),
  fullscreen: z.string(),
  subtitles: z.string(),
  increasePlaybackRate: z.string(),
  decreasePlaybackRate: z.string(),
  downloadVideo: z.string(),
});
export declare type KeyboardShortcuts = z.infer<typeof keyboardShortcutsSchema>;

export const DEFAULT_SHORTCUTS: KeyboardShortcuts = Object.freeze({
  playPause: "Space",
  forward: "ArrowRight",
  backward: "ArrowLeft",
  fullscreen: "F",
  subtitles: "C",
  increasePlaybackRate: "Ctrl + ArrowUp",
  decreasePlaybackRate: "Ctrl + ArrowDown",
  downloadVideo: "Alt + Shift + D",
});

function checkValueExists(
  value: string,
  object: { [key: string]: string }
): boolean {
  return Object.values(object).some((v) => v === value);
}

// Normalize handle backward compatibility with old shortcuts.
function normalizeShortcut(shortcut: string): string {
  // Previously characters were shown and stored as 'A/a' instead of 'A'.
  return shortcut.replace(/([A-Z])\/[a-z]/g, "$1");
}

export function keyboardShortcutsFromUnknown(
  unparsedKeyboardShortcuts: unknown
): KeyboardShortcuts {
  if (!unparsedKeyboardShortcuts) {
    return DEFAULT_SHORTCUTS;
  }
  const parsedKeyboardShortcuts = keyboardShortcutsSchema
    .partial()
    .parse(unparsedKeyboardShortcuts);
  let shortcuts: Partial<KeyboardShortcuts> = {};
  for (const [k, v] of Object.entries(DEFAULT_SHORTCUTS) as Array<
    [keyof KeyboardShortcuts, string]
  >) {
    if (parsedKeyboardShortcuts[k]) {
      shortcuts[k] = parsedKeyboardShortcuts[k];
    } else {
      // If the shortcut is not set (can happen when we add a new shortcut after the user has already set their own shortcuts),
      // we set it to the default value if it is doesn't conflict with other shortcut and disable it otherwise.
      if (checkValueExists(v, parsedKeyboardShortcuts)) {
        shortcuts[k] = DISABLED_KEYBOARD_SHORTCUT;
      } else {
        shortcuts[k] = v;
      }
    }

    shortcuts[k] = normalizeShortcut(shortcuts[k]!);
  }
  return shortcuts as KeyboardShortcuts;
}

export declare interface KeyboardPress {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  key: string;
}

function keyboardPresstoString(pressed: KeyboardPress): string {
  // Needed to make the format of the event.code compatible with event.key.
  if (pressed.key.length === 4 && pressed.key.startsWith("Key")) {
    pressed.key = pressed.key[3];
  }
  if (pressed.key.length === 1) {
    pressed.key = pressed.key.toUpperCase();
  }
  if (pressed.key === " ") {
    pressed.key = "Space";
  }

  if (
    pressed.key.length !== 1 &&
    !pressed.key.startsWith("Arrow") &&
    !pressed.key.startsWith("Page") &&
    pressed.key !== "Home" &&
    pressed.key !== "End" &&
    pressed.key !== "Space"
  ) {
    return INVALID_KEYBOARD_SHORTCUT;
  }

  if (pressed.key === " ") {
    pressed.key = "Space";
  }

  let final = "";
  final += pressed.ctrl ? "Ctrl + " : "";
  final += pressed.alt ? "Alt + " : "";
  final += pressed.meta ? "Meta + " : "";
  final += pressed.shift ? "Shift + " : "";
  final += pressed.key;
  return final;
}

type KeyboardEventPartial = Pick<
  KeyboardEvent,
  "ctrlKey" | "shiftKey" | "altKey" | "metaKey" | "code"
>;

export function keyboardEventToString(e: KeyboardEventPartial): string {
  const pressed: KeyboardPress = {
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
    alt: e.altKey,
    meta: e.metaKey,
    key: e.code,
  };

  return keyboardPresstoString(pressed);
}

export const exportedForTesting = {
  normalizeShortcut,
};
