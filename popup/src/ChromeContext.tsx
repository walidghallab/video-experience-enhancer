import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ChromeContextProps {
  url: string;
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

const ChromeContext = createContext<ChromeContextProps|undefined>(undefined);

function ChromeContextProvider({children, mockValue}: { children: React.ReactNode, mockValue?: ChromeContextProps }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    getCurrentUrl(mockValue).then((url) => {
      setUrl(url);
    });
  }, [mockValue]);

  const value = useMemo(() => ({ url }), [url]);

  return (
    <ChromeContext.Provider value={value}>
      {children}
    </ChromeContext.Provider>
  );
}

export const useChromeContext = () => useContext(ChromeContext);

export default ChromeContextProvider;