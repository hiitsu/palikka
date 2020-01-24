import { XY } from "./primitives";

export function screenWidth(): number | null {
  if (!window || !window.screen) {
    return null;
  }
  return window.screen.width;
}

export function elementWidth(selector: string): number | null {
  if (!window || !window.document) {
    return null;
  }
  const el = window.document.querySelector(selector);
  if (!el) {
    return null;
  }
  const rect = el.getBoundingClientRect();
  if (!rect) {
    return null;
  }
  return rect.width;
}

export function elementTopLeft(selector: string): DOMRect | null {
  if (!window || !window.document) {
    return null;
  }
  const el = document.querySelector(selector);
  if (!el) {
    return el;
  }
  const rect = el.getBoundingClientRect();
  return rect;
}

export function squareTopLeft(x: number, y: number): DOMRect | null {
  return elementTopLeft(`[data-square-id="${x}-${y}"]`);
}

export function isPointInside(container: HTMLElement, point: XY) {
  const el = window.document.elementFromPoint(point.x, point.y);
  return container.contains(el);
}

export function areCornersInside(container: HTMLElement, topLeft: XY, topRight: XY, bottomLeft: XY, bottomRight: XY) {
  return (
    isPointInside(container, topLeft) &&
    isPointInside(container, topRight) &&
    isPointInside(container, bottomLeft) &&
    isPointInside(container, bottomRight)
  );
}

export function getViewportHeight(element: HTMLElement) {
  if (element === document.body) {
    return window.innerHeight || document.documentElement.clientHeight;
  } else {
    return element.clientHeight;
  }
}

export function getContentHeight(element: HTMLElement) {
  if (element === document.body) {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  } else {
    return element.scrollHeight;
  }
}

export function scrollTop(element: HTMLElement) {
  if (element === document.body) {
    return (
      window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
    );
  } else {
    return element.scrollTop;
  }
}

export function scrollLeft(element: HTMLElement) {
  if (element === document.body) {
    return (
      window.pageXOffset ||
      (document.documentElement && document.documentElement.scrollLeft) ||
      document.body.scrollLeft
    );
  } else {
    return element.scrollLeft;
  }
}

export function elementOffset(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  return {
    top: rect.top + scrollTop(document.body),
    left: rect.left + scrollLeft(document.body)
  };
}
