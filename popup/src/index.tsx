import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ChromeContextProvider from "./contexts/ChromeContext";
import { getMockValueForChromeContextProps } from "./test-helpers/ChromeContextProps.mock";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const mockValue = getMockValueForChromeContextProps();

root.render(
  <React.StrictMode>
    {/* The mockValue gets removed automatically by the build script to use the real values for the extension. */}
    <ChromeContextProvider mockValue={mockValue}>
      <App />
    </ChromeContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
