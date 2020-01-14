import { Block, Slot, PositionedBlock, Size } from "./primitives";
import { sizeOf, allBlockVariations } from "./block";
import { arrayShuffle, arrayOfPoints } from "./util";
import { canFit, colorGrid, allocationGrid } from "./grid";

export const blocks: Block[] = [
  [[1]],

  [[1], [1]],

  [
    [1, 1],
    [1, 0]
  ],
  [[1, 1, 1]],

  // 4 squares
  [
    [0, 1],
    [1, 1],
    [0, 1]
  ],
  [
    [1, 0],
    [1, 1],
    [0, 1]
  ],
  [
    [1, 1],
    [1, 1]
  ],

  [[1, 1, 1, 1]],

  // 5 squares
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],

  [
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ],

  [[1, 1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
    [0, 1]
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0]
  ],

  // 6 squares
  [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0, 0],
    [1, 1, 1, 1]
  ],
  [
    [1, 0, 1, 0],
    [1, 1, 1, 1]
  ],
  [
    [1, 0, 0, 1],
    [1, 1, 1, 1]
  ],

  // 7 squares
  [
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 1],
    [1, 1, 0],
    [1, 1, 0]
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 1, 0],
    [1, 1, 1, 1]
  ],

  // 8 squares
  [
    [1, 1, 1],
    [1, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 0]
  ],
  [
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 1, 0]
  ],
  [
    [1, 0, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1]
  ],
  [
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1]
  ],

  // 9 quares
  [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ],
  [
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [1, 1, 0, 0]
  ],

  // 10 squares
  [
    [1, 1, 1, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 1, 1],
    [1, 1, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0]
  ],
  [
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 0, 0],
    [1, 0, 0, 0]
  ],
  [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 0]
  ]
];

export function randomPuzzle(puzzleSize: Size, maxBlockSize = 10) {
  const blocksWithMatchingSize = allBlockVariations(blocks.filter(block => sizeOf(block) <= maxBlockSize));
  const positionedBlocks: Array<PositionedBlock> = [];

  const points = arrayShuffle(arrayOfPoints(puzzleSize.w, puzzleSize.h));

  const blockGroups = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(size => {
    return blocksWithMatchingSize
      .sort((a, b) => sizeOf(b) - sizeOf(a))
      .filter(block => sizeOf(block) < size + 1 && sizeOf(block) >= size);
  });

  const biggerBlockGroups = blockGroups.slice(0, 3);
  const smallerBlockGroups = blockGroups.slice(3, 6);
  const tinyBlockGroups = blockGroups.slice(6, 9);

  points.forEach(({ x, y }) => {
    biggerBlockGroups.forEach(blockGroup => {
      const shuffledBlockGroup = arrayShuffle(blockGroup);
      shuffledBlockGroup.forEach(block => {
        if (canFit(puzzleSize, positionedBlocks, { block, x, y })) {
          positionedBlocks.push({ block, x, y });
        }
      });
    });
  });

  smallerBlockGroups.forEach(blockGroup => {
    blockGroup.forEach(block => {
      points.forEach(({ x, y }) => {
        if (canFit(puzzleSize, positionedBlocks, { block, x, y })) {
          positionedBlocks.push({ block, x, y });
        }
      });
    });
  });

  tinyBlockGroups.forEach(blockGroup => {
    blockGroup.forEach(block => {
      points.forEach(({ x, y }) => {
        const offsets = arrayOfPoints(block[0].length, block.length, true);
        offsets.forEach(offset => {
          if (canFit(puzzleSize, positionedBlocks, { block, x: x + offset.x, y: y + offset.y })) {
            positionedBlocks.push({ block, x: x + offset.x, y: y + offset.y });
          }
        });
      });
    });
  });

  const p = {
    positionedBlocks,
    size: puzzleSize,
    blocks: positionedBlocks.map(p => p.block),
    colorGrid: colorGrid(puzzleSize, positionedBlocks)
  };

  return p;
}

export function isComplete(size: Size, positionedBlocks: PositionedBlock[]): boolean {
  const totalCount = size.w * size.h;
  const grid = allocationGrid(size, positionedBlocks);
  const allocatedCount = new Array<Slot>()
    .concat(...grid)
    .reduce((memo, slot) => (slot == Slot.Taken ? memo + 1 : memo));
  return allocatedCount === totalCount;
}
