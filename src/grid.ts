import { array2D } from "./util";
import { Block, Slot } from "./primitives";

export class Grid {
  slots: Array<Array<Slot>>;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.slots = array2D<Slot>(width, height, () => Slot.Empty);
  }

  canFit(x: number, y: number, block: Block) {
    const blockWidth = block[0].length;
    const blockHeight = block.length;
    for (let i = 0; i < blockWidth; i++) {
      for (let j = 0; j < blockHeight; j++) {
        const isInside =
          this.slots[y + j] && typeof this.slots[y + j][x + i] === "number";
        if (
          isInside &&
          this.slots[y + j][x + i] === Slot.Taken &&
          block[j][i] === Slot.Taken
        )
          return false;
        if (!isInside && block[j][i] === Slot.Taken) return false;
      }
    }
    return true;
  }

  mergeBlock(x: number, y: number, block: Block) {
    const blockWidth = block[0].length;
    const blockHeight = block.length;
    for (let i = 0; i < blockWidth; i++) {
      for (let j = 0; j < blockHeight; j++) {
        const isInside =
          this.slots[y + j] && typeof this.slots[y + j][x + i] === "number";
        const isTaken = block[j][i] === Slot.Taken;
        if (isInside && isTaken) {
          this.slots[y + j][x + i] = block[j][i];
        }
      }
    }
  }

  forEach(x: number, y: number, w: number, h: number, callback: () => void) {}

  isEmpty(x: number, y: number) {
    return this.slots[x][y] === Slot.Empty;
  }
}
