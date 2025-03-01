const isElementFocusable = (element: HTMLElement | null) =>
  element && typeof element.focus === "function";

export default isElementFocusable;
