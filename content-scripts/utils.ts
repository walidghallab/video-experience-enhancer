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

// We need to make sure those constants are unique across all websites so they are randomly generated constants.
export const SNACKBAR_ID = "snackbar-iqrvzpgvtse1s9mp19q8yyve5p2k2urk";
export const SNACKBAR_SHOW_CLASS = `show-${SNACKBAR_ID}`;
export const SNACKBAR_HIDE_CLASS = `hide-${SNACKBAR_ID}`;
const FADE_IN_ANIMATION = `fadein-${SNACKBAR_ID}`;
const FADE_OUT_ANIMATION = `fadeout-${SNACKBAR_ID}`;

const SNACKBAR_PERIOD = 3000; // 3 seconds
const SNACKBAR_SET_TIMEOUT_DATA_ATTRIBUTE = "data-snackbar-set-timeout"; // Used to clear setTimeout when the snackbar is shown again before the timeout is reached.

export function insertSnackbar() {
  if (document.getElementById(SNACKBAR_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.innerHTML = `
    #${SNACKBAR_ID} {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #333;
      color: #fff;
      text-align: center;
      border-radius: 2px;
      padding: 16px;
      position: fixed;
      z-index: 1;
      left: 50%;
      bottom: 30px;
      font-size: 17px;
    }
    
    #${SNACKBAR_ID}.${SNACKBAR_SHOW_CLASS} {
      visibility: visible;
      -webkit-animation: ${FADE_IN_ANIMATION} 0.5s;
      animation: ${FADE_IN_ANIMATION} 0.5s;
      animation-fill-mode: forwards;
    }

    #${SNACKBAR_ID}.${SNACKBAR_HIDE_CLASS} {
      visibility: visible;
      -webkit-animation: ${FADE_OUT_ANIMATION} 0.5s;
      animation: ${FADE_OUT_ANIMATION} 0.5s;
      animation-fill-mode: forwards;
    }
    
    @-webkit-keyframes ${FADE_IN_ANIMATION} {
      from {bottom: 0; opacity: 0;} 
      to {bottom: 30px; opacity: 1;}
    }
    
    @keyframes ${FADE_IN_ANIMATION} {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }
    
    @-webkit-keyframes ${FADE_OUT_ANIMATION} {
      from {bottom: 30px; opacity: 1;} 
      to {bottom: 0; opacity: 0;}
    }
    
    @keyframes ${FADE_OUT_ANIMATION} {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div id="${SNACKBAR_ID}"></div>
  `;
  wrapper.appendChild(style);
  document.body.appendChild(wrapper);
}

// showSnackbar shows a snackbar with the given message for {@link SNACKBAR_PERIOD}.
// If the snackbar is called again before the timeout is finished, it will reset the timeout and update the message.
export function showSnackbar(message: string) {
  const snackbar = document.getElementById(SNACKBAR_ID);
  if (!snackbar) {
    console.error("Snackbar not found");
    return;
  }
  snackbar.innerHTML = message;
  if (snackbar.className.includes(SNACKBAR_SHOW_CLASS)) {
    clearTimeout(
      Number(snackbar.getAttribute(SNACKBAR_SET_TIMEOUT_DATA_ATTRIBUTE))
    );
  }
  snackbar.className = SNACKBAR_SHOW_CLASS;
  const setTimeoutVal = setTimeout(function () {
    snackbar.className = snackbar.className.replace(
      SNACKBAR_SHOW_CLASS,
      SNACKBAR_HIDE_CLASS
    );
  }, SNACKBAR_PERIOD);

  snackbar.setAttribute(
    SNACKBAR_SET_TIMEOUT_DATA_ATTRIBUTE,
    String(setTimeoutVal)
  );
}
