import { array2D } from "./util";
import { Slot, AllocationGrid, PositionedBlock, Size, Color, ColorGrid } from "./primitives";

export function allocationGrid(size: Size, positionedBlocks: PositionedBlock[]): AllocationGrid {
  const grid: AllocationGrid = array2D<Slot>(size.w, size.h, () => Slot.Empty);
  positionedBlocks.forEach(({ x, y, block }) => {
    const blockWidth = block[0].length;
    const blockHeight = block.length;
    for (let i = 0; i < blockWidth; i++) {
      for (let j = 0; j < blockHeight; j++) {
        const isInside = grid[y + j] && typeof grid[y + j][x + i] === "number";
        const isTaken = isInside && grid[y + j][x + i] == Slot.Taken;
        const isBlockPieceThere = block[j][i] === Slot.Taken;
        if (isInside && !isTaken && isBlockPieceThere) {
          grid[y + j][x + i] = Slot.Taken;
        }
      }
    }
  });
  return grid;
}

export function canFit(size: Size, positionedBlocks: PositionedBlock[], proposedBlock: PositionedBlock): boolean {
  const grid: AllocationGrid = allocationGrid(size, positionedBlocks);
  const { block, x, y } = proposedBlock;
  const blockWidth = block[0].length;
  const blockHeight = block.length;
  for (let i = 0; i < blockWidth; i++) {
    for (let j = 0; j < blockHeight; j++) {
      const isInside = grid[y + j] && typeof grid[y + j][x + i] === "number";
      const isTakenAlready = isInside && grid[y + j][x + i] === Slot.Taken;
      const isBlockPieceThere = block[j][i] === Slot.Taken;
      if (isInside && isTakenAlready && isBlockPieceThere) return false;
      if (!isInside && isBlockPieceThere) return false;
    }
  }
  return true;
}

export function colorGrid(size: Size, positionedBlocks: PositionedBlock[], colors: Color[]): ColorGrid {
  const grid: ColorGrid = array2D<Color>(size.w, size.h, () => 0);
  positionedBlocks.forEach(({ x, y, block }, blockIndex) => {
    const blockWidth = block[0].length;
    const blockHeight = block.length;
    for (let i = 0; i < blockWidth; i++) {
      for (let j = 0; j < blockHeight; j++) {
        const isVerticallyInside = y + j < size.h;
        const isHorizontallyInside = x + i < size.w;
        const isInside = isVerticallyInside && isHorizontallyInside;
        const isBlockPieceThere = block[j][i] === Slot.Taken;
        if (isInside && isBlockPieceThere) {
          grid[y + j][x + i] = colors[blockIndex];
        }
      }
    }
  });
  return grid;
}
