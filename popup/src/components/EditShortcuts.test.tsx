import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import EditShortcuts, {
  WAITING_TIME_TO_SHOW_INVALID_ERROR,
} from "./EditShortcuts";
import ChromeContextProvider, {
  useChromeContext,
} from "../contexts/ChromeContext";
import { getMockValueForChromeContextProps } from "../test-helpers/ChromeContextProps.mock";
import { act } from "react-dom/test-utils";

function TestContextValueForBackward() {
  const chromeContext = useChromeContext();
  return (
    <p data-testid="test-context">
      {chromeContext?.keyboardShortcuts.backward}
    </p>
  );
}

describe("EditShortcuts", () => {
  it.each([
    {
      name: "saves changes context correctly",
      buttonToClick: "Save",
      expectedSavedValue: "Ctrl + A/a",
      expectedShownValue: "Ctrl + A/a",
      expectFinishedEditingBeCalled: true,
    },
    {
      name: "cancel doesn't change context",
      buttonToClick: "Cancel",
      expectedSavedValue: "Ctrl + E/e",
      expectedShownValue: "Ctrl + A/a",
      expectFinishedEditingBeCalled: true,
    },
    {
      name: "restore defaults correctly in the input values but not in the context",
      buttonToClick: "Restore defaults",
      expectedSavedValue: "Ctrl + E/e",
      expectedShownValue: "ArrowLeft",
      expectFinishedEditingBeCalled: false,
    },
  ])(
    "$name",
    async ({
      name,
      buttonToClick,
      expectedSavedValue,
      expectedShownValue,
      expectFinishedEditingBeCalled,
    }) => {
      // Arrange
      const finishedEditing = jest.fn();
      const mockValue = getMockValueForChromeContextProps();
      mockValue.keyboardShortcuts.backward = "Ctrl + E/e"; // Set initial value to be different from default
      render(
        <ChromeContextProvider mockValue={mockValue}>
          <EditShortcuts finishedEditing={finishedEditing} />
          <TestContextValueForBackward />
        </ChromeContextProvider>
      );
      await waitFor(() =>
        expect(screen.getByTestId("test-context").textContent).toBe(
          "Ctrl + E/e"
        )
      );
      const input = await screen.findByLabelText(/Backward 5 seconds/);
      await waitFor(() =>
        expect(input.getAttribute("value")).toBe("Ctrl + E/e")
      );

      // Act
      const mockEvent = {
        key: "a",
        code: "KeyA",
        ctrlKey: true,
        altKey: false,
        preventDefault: jest.fn(),
      };
      fireEvent.keyDown(input, mockEvent);
      fireEvent.click(screen.getByText(buttonToClick));

      // Assert
      expect(finishedEditing).toHaveBeenCalledTimes(
        expectFinishedEditingBeCalled ? 1 : 0
      );
      expect(screen.getByTestId("test-context").textContent).toBe(
        expectedSavedValue
      );
      expect(input.getAttribute("value")).toBe(expectedShownValue);
    }
  );

  it("shows error when shortcuts are not unique", async () => {
    // Arrange
    const mockValue = getMockValueForChromeContextProps();
    mockValue.keyboardShortcuts.backward = "Ctrl + E/e"; // Set initial value to be different from default
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <EditShortcuts finishedEditing={jest.fn()} />
      </ChromeContextProvider>
    );
    await waitFor(() =>
      expect(
        screen.getByLabelText(/Backward 5 seconds/).getAttribute("value")
      ).toBe("Ctrl + E/e")
    );

    // Act
    const input = await screen.findByLabelText(/Forward 5 seconds/);
    const mockEvent = {
      key: "e",
      code: "KeyE",
      ctrlKey: true,
      altKey: false,
      preventDefault: jest.fn(),
    };
    fireEvent.keyDown(input, mockEvent);

    // Assert
    expect(
      screen.getByText(/All shortcuts have to be unique/)
    ).toBeInTheDocument();
  });

  it("shows error when a shortcut is not valid", async () => {
    // Arrange
    jest.useFakeTimers();
    const mockValue = getMockValueForChromeContextProps();
    mockValue.keyboardShortcuts.backward = "Ctrl + E/e"; // Set initial value to be different from default
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <EditShortcuts finishedEditing={jest.fn()} />
      </ChromeContextProvider>
    );
    await waitFor(() =>
      expect(
        screen.getByLabelText(/Backward 5 seconds/).getAttribute("value")
      ).toBe("Ctrl + E/e")
    );

    // Act
    const input = await screen.findByLabelText(/Backward 5 seconds/);
    const mockEvent = {
      key: "Control",
      code: "ControlLeft",
      ctrlKey: false,
      altKey: false,
      preventDefault: jest.fn(),
    };
    fireEvent.keyDown(input, mockEvent);
    act(() => {
      jest.advanceTimersByTime(WAITING_TIME_TO_SHOW_INVALID_ERROR);
    });

    // Assert
    await screen.findByText(/All shortcuts have to be valid/);

    // Cleanup
    jest.useRealTimers();
  });
});
