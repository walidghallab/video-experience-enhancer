import { z } from "zod";

export const DISABLED_KEYBOARD_SHORTCUT = "DISABLED";
const INVALID_KEYBOARD_SHORTCUT = "INVALID";

export const KeyboardShortcutStorageKey = "keyboardShortcuts";

const keyboardShortcutsSchema = z.object({
    playPause: z.string(),
    forward: z.string(),
    backward: z.string(),
    fullscreen: z.string(),
    subtitles: z.string(),
    increasePlaybackRate: z.string(),
    decreasePlaybackRate: z.string(), 
});
export declare type KeyboardShortcuts = z.infer<typeof keyboardShortcutsSchema>;


export const defaultShortcuts: KeyboardShortcuts = {
  playPause: "Space",
  forward: "ArrowRight",
  backward: "ArrowLeft",
  fullscreen: "F/f",
  subtitles: "C/c",
  increasePlaybackRate: "Ctrl + ArrowUp",
  decreasePlaybackRate: "Ctrl + ArrowDown",
};

function checkValueExists(
  value: string,
  object: { [key: string]: string }
): boolean {
  return Object.values(object).some((v) => v === value);
}

export function keyboardShortcutsFromUnknown(unparsedKeyboardShortcuts: unknown): KeyboardShortcuts {
  if (!unparsedKeyboardShortcuts) {
    return defaultShortcuts;
  }
  const parsedKeyboardShortcuts = keyboardShortcutsSchema.partial().parse(unparsedKeyboardShortcuts);
  let shortcuts: Partial<KeyboardShortcuts> = {};
  for (const [k, v] of Object.entries(defaultShortcuts) as Array<
    [keyof KeyboardShortcuts, string]
  >) {
    if (
      parsedKeyboardShortcuts[k]
    ) {
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
  }
  return shortcuts as KeyboardShortcuts;
}

export declare interface KeyboardPress {
  // Order is important as it is used in storing its value as string, and 'Key' should be the last one.
  Ctrl: boolean;
  Shift: boolean;
  Alt: boolean;
  Meta: boolean;
  Key: string;
}

function keyboardPresstoString(pressed: KeyboardPress): string {
  if (pressed.Key === " ") {
    pressed.Key = "Space";
  }

  if (pressed.Key.length === 1) {
    pressed.Key = `${pressed.Key.toUpperCase()}/${pressed.Key.toLowerCase()}`;
  }

  let final = "";
  for (const [k, v] of Object.entries(pressed)) {
    if (typeof v === "boolean" && v) {
      final += k + " + ";
    } else if (typeof v === "string") {
      final += v;
    }
  }
  return final;
}

type KeyboardEventPartial = Pick<KeyboardEvent, "ctrlKey" | "shiftKey" | "altKey" | "metaKey" | "key">;

export function keyboardEventToString(e: KeyboardEventPartial): string {
  const pressed = {
    Ctrl: e.ctrlKey,
    Shift: e.shiftKey,
    Alt: e.altKey,
    Meta: e.metaKey,
    Key: e.key,
  };

  if (
    pressed.Key.length !== 1 &&
    !pressed.Key.startsWith("Arrow") &&
    !pressed.Key.startsWith("Page") &&
    pressed.Key !== "Home" &&
    pressed.Key !== "End"
  ) {
    return INVALID_KEYBOARD_SHORTCUT;
  }

  return keyboardPresstoString(pressed);
}
