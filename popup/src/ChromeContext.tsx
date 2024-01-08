import { createContext, useContext, useEffect, useMemo, useState } from "react";

export declare interface ChromeContextProps {
  url: string;
  disabled: boolean;
  setDisabled: (disabled: boolean) => void;
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

function setDisabledState(disabled: boolean, mockValue?: ChromeContextProps): Promise<void> {
  if (mockValue) {
    return Promise.resolve(mockValue.setDisabled(disabled));
  }
  return new Promise((resolve) => {
    chrome.storage.sync.set({ disabled }, () => {
      resolve();
    });
  });
}

const ChromeContext = createContext<ChromeContextProps|undefined>(undefined);

function ChromeContextProvider({children, mockValue}: { children: React.ReactNode, mockValue?: ChromeContextProps }) {
  const [url, setUrl] = useState("");
  const [disabled, setDisabled] = useState(false);

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

  // Used useMemo to avoid unnecessary re-renders since it is passed in the 'value' dependencies (bec of ESLint).
  const updateDisabledState = useMemo(() => function (disabled: boolean) {
    setDisabled(disabled);
    setDisabledState(disabled, mockValue);
  }, [mockValue]);
  
  const value = useMemo(() => ({ url, disabled, setDisabled: updateDisabledState}), [url, disabled, updateDisabledState]);

  return (
    <ChromeContext.Provider value={value}>
      {children}
    </ChromeContext.Provider>
  );
}

export const useChromeContext = () => useContext(ChromeContext);

export default ChromeContextProvider;