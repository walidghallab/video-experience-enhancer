import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import EditShortcuts from "./EditShortcuts";
import ChromeContextProvider, {
  getMockValue,
  useChromeContext,
} from "../contexts/ChromeContext";

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
      name: "saves changes correctly",
      buttonToClick: "Save",
      expectedSavedValue: "Ctrl + A/a",
      expectedShownValue: "Ctrl + A/a",
      expectFinishedEditingBeCalled: true,
    },
    {
      name: "cancel changes correctly",
      buttonToClick: "Cancel",
      expectedSavedValue: "Ctrl + E/e",
      expectedShownValue: "Ctrl + A/a",
      expectFinishedEditingBeCalled: true,
    },
    {
      name: "restore defaults correctly",
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
      const mockValue = getMockValue();
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

      // Act
      const input = await screen.findByLabelText(/Backward 5 seconds/);
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
      expect(input.getAttribute('value')).toBe(expectedShownValue);
    }
  );
});
