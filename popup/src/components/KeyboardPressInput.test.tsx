import { render, fireEvent, screen } from "@testing-library/react";
import KeyboardPressInput from "./KeyboardPressInput";

describe("KeyboardPressInput", () => {
  it("displays correct value", async () => {
    const setValue = jest.fn();
    render(
      <KeyboardPressInput value={'A/a'} setvalue={setValue} label="Test Input" />
    );
    const input = await screen.findByLabelText(/Test Input/);
    expect(input).toHaveValue("A/a");
  });

  it("captures key press and sets value", async () => {
    const setValue = jest.fn();
    render(
      <KeyboardPressInput value="" setvalue={setValue} label="Test Input" />
    );

    const input = await screen.findByLabelText(/Test Input/);
    const mockEvent = { key: "a", code: "KeyA", ctrlKey: true, altKey: false, preventDefault: jest.fn() };
    fireEvent.keyDown(input, mockEvent);

    expect(setValue).toHaveBeenCalledWith("Ctrl + A/a");
  });
});
