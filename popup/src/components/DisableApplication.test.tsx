import { render, fireEvent, screen } from "@testing-library/react";
import DisableApplication from "./DisableApplication";
import ChromeContextProvider from "../contexts/ChromeContext";
import { getMockValueForChromeContextProps } from "../test-helpers/ChromeContextProps.mock";

describe("DisableApplication", () => {
  it("renders correctly based on disabled state", async () => {
    let mockValue = { ...getMockValueForChromeContextProps(), disabled: false };
    const { rerender } = render(
      <ChromeContextProvider mockValue={mockValue}>
        <DisableApplication />
      </ChromeContextProvider>
    );

    expect(await screen.findByText("Extension is enabled")).toBeInTheDocument();

    mockValue = { ...getMockValueForChromeContextProps(), disabled: true };
    rerender(
      <ChromeContextProvider mockValue={mockValue}>
        <DisableApplication />
      </ChromeContextProvider>
    );

    expect(
      await screen.findByText("Extension is disabled")
    ).toBeInTheDocument();
  });

  it("calls setDisabled with correct value when slider is clicked", async () => {
    const setDisabled = jest.fn();
    let mockValue = {
      ...getMockValueForChromeContextProps(),
      disabled: false,
      setDisabled,
    };
    render(
      <ChromeContextProvider mockValue={mockValue}>
        <DisableApplication />
      </ChromeContextProvider>
    );
    
    fireEvent.click(await screen.findByTestId("toggle-disable"));
    
    expect(setDisabled).toHaveBeenCalledWith(true);
  });
});
