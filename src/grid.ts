import { arrayWith } from "./util";
import { Slot } from "./primitives";
import { Shape } from "./shape";

export class Grid {
  slots: Array<Array<Slot>>;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.slots = arrayWith(height, 1).map(() => arrayWith(width, Slot.Empty));
  }

  canFit(x: number, y: number, shape: Shape) {
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;
    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        const isInside =
          this.slots[y + j] && typeof this.slots[y + j][x + i] === "number";
        if (
          isInside &&
          this.slots[y + j][x + i] === Slot.Taken &&
          shape[j][i] === Slot.Taken
        )
          return false;
        if (!isInside && shape[j][i] === Slot.Taken) return false;
      }
    }
    return true;
  }

  mergeShape(x: number, y: number, shape: Shape) {
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;
    for (let i = 0; i < shapeWidth; i++) {
      for (let j = 0; j < shapeHeight; j++) {
        const isInside =
          this.slots[y + j] && typeof this.slots[y + j][x + i] === "number";
        const isTaken = shape[j][i] === Slot.Taken;
        if (isInside && isTaken) {
          this.slots[y + j][x + i] = shape[j][i];
        }
      }
    }
  }

  forEach(x: number, y: number, w: number, h: number, callback: () => void) {}

  isEmpty(x: number, y: number) {
    return this.slots[x][y] === Slot.Empty;
  }
}
