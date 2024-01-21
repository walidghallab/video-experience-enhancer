import { SNACKBAR_HIDE_CLASS, SNACKBAR_ID, SNACKBAR_SHOW_CLASS, insertSnackbar, showSnackbar } from "./utils";

const SECOND = 1000;

describe("snackbar functionality", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should insert the snackbar element into the document body", () => {
    insertSnackbar();

    const snackbarElement = document.getElementById(SNACKBAR_ID);
    expect(snackbarElement).toBeDefined();
  });

  it("shouldn't insert the snackbar element into the document body if it already exists", () => {
    insertSnackbar();
    insertSnackbar();

    const snackbarElements = document.querySelectorAll(`#${SNACKBAR_ID}`);
    expect(snackbarElements.length).toBe(1);
  });

  it("should be invisible initially", () => {
    insertSnackbar();

    const snackbarElement = document.getElementById(SNACKBAR_ID);
    expect(window.getComputedStyle(snackbarElement!).visibility).toBe('hidden');
    expect(snackbarElement?.className).toBe("");
  });

  it("should set the snackbar class to 'show' when the snackbar is shown", () => {
    insertSnackbar();

    const snackbarElement = document.getElementById(SNACKBAR_ID)!;
    showSnackbar("test");

    expect(snackbarElement.className).toBe(SNACKBAR_SHOW_CLASS);
  });

  it("should set the snackbar class to 'hide' after 3 seconds", () => {
    insertSnackbar();

    const snackbarElement = document.getElementById(SNACKBAR_ID)!;
    showSnackbar("test");
    jest.advanceTimersByTime(2 * SECOND);

    expect(snackbarElement.className).toBe(SNACKBAR_SHOW_CLASS);

    jest.advanceTimersByTime(1 * SECOND);

    expect(snackbarElement?.className).toBe(SNACKBAR_HIDE_CLASS);
  });

  it("should update the snackbar timer every time it is being shown", () => {
    insertSnackbar();

    const snackbarElement = document.getElementById(SNACKBAR_ID)!;
    showSnackbar("test");
    jest.advanceTimersByTime(2 * SECOND);
    expect(snackbarElement.className).toBe(SNACKBAR_SHOW_CLASS);

    showSnackbar("test");
    jest.advanceTimersByTime(2 * SECOND);
    expect(snackbarElement.className).toBe(SNACKBAR_SHOW_CLASS);

    showSnackbar("test");
    jest.advanceTimersByTime(2 * SECOND);
    expect(snackbarElement.className).toBe(SNACKBAR_SHOW_CLASS);


    jest.advanceTimersByTime(1 * SECOND);
    expect(snackbarElement?.className).toBe(SNACKBAR_HIDE_CLASS);
  });
});