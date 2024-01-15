import { TextField } from "@mui/material";
import { keyboardEventToString } from "./common/keyboard_shortcuts";

function KeyboardPressInput(props: {
  value: string;
  setvalue: (value: string) => void;
  label: string;
  id?: string;
}) {
  const handleCapture = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pressedValue = keyboardEventToString(event);

    props.setvalue(pressedValue);
  };

  return (
    <TextField
      id={props.id}
      size="small"
      label={props.label}
      value={props.value}
      onKeyDown={handleCapture}
      InputProps={{ readOnly: true }}
    />
  );
}

export default KeyboardPressInput;