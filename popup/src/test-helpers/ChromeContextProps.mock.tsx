import { KeyboardShortcuts, DEFAULT_SHORTCUTS } from "../common/keyboard_shortcuts";
import { ChromeContextProps } from "../contexts/ChromeContext";

/**
 *  Returns mock value for {@link ChromeContextProps}.
 * 
 * __Should never be used in production code.__
 */
export function getMockValueForChromeContextProps(): ChromeContextProps {
    let disabled = false;
    let shortcuts = {...DEFAULT_SHORTCUTS};
    return {
      url: "https://coursera.org/",
      disabled,
      setDisabled: (newDisabled: boolean) => {
        disabled = newDisabled;
      },
      keyboardShortcuts: shortcuts,
      setKeyboardShortcuts: (newShortcuts: KeyboardShortcuts) => {
        shortcuts = newShortcuts;
      },
    };
  }