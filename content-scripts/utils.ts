import {
  KeyboardShortcutStorageKey,
  KeyboardShortcuts,
  keyboardShortcutsFromUnknown,
} from "../popup/src/common/keyboard_shortcuts";

export interface LiveProxyStorage {
  keyboardShortcuts: KeyboardShortcuts;
}

export function executeKeyboardEventListener(
  handleKeyDown: (e: KeyboardEvent, liveProxyStorage: LiveProxyStorage) => void
) {
  chrome.storage.sync.get(
    ["disabled", KeyboardShortcutStorageKey],
    function (result) {
      const disabled = result.disabled;
      const unparsedKeyboardShortcuts = result[KeyboardShortcutStorageKey];

      const liveProxyStorage: LiveProxyStorage = {
        keyboardShortcuts: keyboardShortcutsFromUnknown(
          unparsedKeyboardShortcuts
        ),
      };

      const keyDownEventHandler = (e: KeyboardEvent) =>
        handleKeyDown(e, liveProxyStorage);

      if (!disabled) {
        document
          .querySelector("body")!
          .addEventListener("keydown", keyDownEventHandler, true);
      }

      chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (changes.disabled) {
          if (changes.disabled.newValue) {
            document
              .querySelector("body")!
              .removeEventListener("keydown", keyDownEventHandler, true);
          } else {
            document
              .querySelector("body")!
              .addEventListener("keydown", keyDownEventHandler, true);
          }
        }
        if (changes[KeyboardShortcutStorageKey]) {
          liveProxyStorage.keyboardShortcuts = keyboardShortcutsFromUnknown(
            changes[KeyboardShortcutStorageKey].newValue
          );
        }
      });
    }
  );
}

export function downloadVideo(url: string, filename: string) {
  filename = filename || "video";
  if (!url) {
    console.error("No video URL");
    return;
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    console.error(
      `Url ${url} is not supported for download in 'Video experience enhancer' Chrome extension.`
    );
    return;
  }
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    })
    .catch((err) => console.error(err));
}
