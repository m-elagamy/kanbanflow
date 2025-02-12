const isFocusable = (element: HTMLElement | null) =>
  element && typeof element.focus === "function";

export default isFocusable;
