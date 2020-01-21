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
