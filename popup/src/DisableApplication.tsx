import { ChangeEvent } from "react";
import { useChromeContext } from "./ChromeContext";
import "./DisableApplication.css";

function DisableApplication() {
  const { disabled, setDisabled } = useChromeContext()!;
  const onChange = (v: ChangeEvent<HTMLInputElement>) => {
    setDisabled(!v.target.checked);
  };

  return (
    <div className="switch-container">
      <label className="switch">
        <input type="checkbox" checked={!disabled} onChange={onChange} />
        <span className="slider round"></span>
      </label>
      {!disabled ? <p className="success">Extension is enabled</p> : <p className="error">Extension is disabled</p>}
    </div>
  );
}

export default DisableApplication;
