import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SHORTCUTS,
  KeyboardShortcuts,
  keyboardShortcutsFromUnknown,
  KeyboardShortcutStorageKey,
} from "../common/keyboard_shortcuts";

export declare interface ChromeContextProps {
  url: string;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
  keyboardShortcuts: KeyboardShortcuts;
  setKeyboardShortcuts: (shortcuts: KeyboardShortcuts) => void;
}

function getCurrentUrl(mockValue?: ChromeContextProps): Promise<string> {
  if (mockValue) {
    return Promise.resolve(mockValue.url);
  }
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        if (tabs.length > 0) {
          resolve(tabs[0].url || "");
        } else {
          reject();
        }
      }
    );
  });
}

function getKeyboardShortcuts(
  mockValue?: ChromeContextProps
): Promise<KeyboardShortcuts> {
  if (mockValue) {
    return Promise.resolve(mockValue.keyboardShortcuts);
  }
  return new Promise((resolve) => {
    chrome.storage.sync.get([KeyboardShortcutStorageKey], (result) => {
      resolve(keyboardShortcutsFromUnknown(result[KeyboardShortcutStorageKey]));
    });
  });
}

function setKeyboardShortcutsInStorage(
  shortcuts: KeyboardShortcuts,
  mockValue?: ChromeContextProps
): Promise<void> {
  if (mockValue) {
    return Promise.resolve(mockValue.setKeyboardShortcuts(shortcuts));
  }
  return new Promise((resolve) => {
    chrome.storage.sync.set({ keyboardShortcuts: shortcuts }, () => {
      resolve();
    });
  });
}

function getDisabledState(mockValue?: ChromeContextProps): Promise<boolean> {
  if (mockValue) {
    return Promise.resolve(mockValue.disabled);
  }
  return new Promise((resolve) => {
    chrome.storage.sync.get(["disabled"], (result) => {
      resolve(result.disabled);
    });
  });
}

function setDisabledInStorage(
  disabled: boolean,
  mockValue?: ChromeContextProps
): Promise<void> {
  if (mockValue) {
    return Promise.resolve(mockValue.setDisabled(disabled));
  }
  return new Promise((resolve) => {
    chrome.storage.sync.set({ disabled }, () => {
      resolve();
    });
  });
}

const ChromeContext = createContext<ChromeContextProps | undefined>(undefined);

function ChromeContextProvider({
  children,
  mockValue,
}: {
  children: React.ReactNode;
  mockValue?: ChromeContextProps;
}) {
  const [url, setUrl] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] =
    useState<KeyboardShortcuts>(DEFAULT_SHORTCUTS);

  useEffect(() => {
    getCurrentUrl(mockValue).then((url) => {
      setUrl(url);
    });
  }, [mockValue]);

  useEffect(() => {
    getDisabledState(mockValue).then((disabled) => {
      setDisabled(disabled);
    });
  }, [mockValue]);

  useEffect(() => {
    getKeyboardShortcuts(mockValue).then((shortcuts) => {
      setKeyboardShortcuts(shortcuts);
    });
  }, [mockValue]);

  // Used useMemo to avoid unnecessary re-renders since it is passed in the dependencies of 'value'.
  const updateDisabledState = useMemo(
    () =>
      function (disabled: boolean) {
        setDisabled(disabled);
        setDisabledInStorage(disabled, mockValue);
      },
    [mockValue]
  );

  const updateKeyboardShortcuts = useMemo(
    () =>
      function (shortcuts: KeyboardShortcuts) {
        setKeyboardShortcuts(shortcuts);
        setKeyboardShortcutsInStorage(shortcuts, mockValue);
      },
    [mockValue]
  );

  const value = useMemo(
    () => ({
      url,
      disabled,
      setDisabled: updateDisabledState,
      keyboardShortcuts,
      setKeyboardShortcuts: updateKeyboardShortcuts,
    }),
    [
      url,
      disabled,
      updateDisabledState,
      keyboardShortcuts,
      updateKeyboardShortcuts,
    ]
  );

  return (
    <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>
  );
}

export const useChromeContext = () => useContext(ChromeContext);

export default ChromeContextProvider;
