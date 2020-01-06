import { Block, Slot, PositionedBlock } from "./primitives";
import { sizeOf, allBlockVariations } from "./block";
import { Grid } from "./grid";
import { arrayWith, arrayShuffle, arrayOfPoints, randomInt } from "./util";

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

export function randomPuzzle(w: number = 6, h: number = 6, maxBlockSize = 10) {
  const puzzle = new Puzzle(w, h);
  const blocksWithMatchingSize = blocks.filter(
    block => sizeOf(block) <= maxBlockSize
  );
  puzzle.fillWith(allBlockVariations(blocksWithMatchingSize));
  return puzzle;
}

export class Puzzle {
  grid: Grid;
  positionedBlocks: Array<PositionedBlock>;

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  reset(width: number, height: number) {
    this.grid = new Grid(width, height);
    this.positionedBlocks = [];
  }

  renderColorGrid() {
    const w = this.grid.width;
    const h = this.grid.height;
    const colorGrid: number[][] = arrayWith(h, 1).map(() => arrayWith(w, 0));
    this.positionedBlocks.forEach((positionedBlock, index) => {
      const block = positionedBlock.block;
      const blockWidth = block[0].length;
      const blockHeight = block.length;
      for (let i = 0; i < blockWidth; i++) {
        for (let j = 0; j < blockHeight; j++) {
          const isInside =
            colorGrid[positionedBlock.y + j] &&
            typeof colorGrid[positionedBlock.y + j][positionedBlock.x + i] ===
              "number";
          const isTaken = block[j][i] === Slot.Taken;
          if (isInside && isTaken) {
            colorGrid[positionedBlock.y + j][positionedBlock.x + i] = index + 1;
          }
        }
      }
    });
    return colorGrid;
  }

  fillWith(blocks: Block[]) {
    const width = this.grid.width;
    const height = this.grid.height;
    this.reset(width, height);
    const points = arrayShuffle(arrayOfPoints(width, height));
    const grid = new Grid(width, height);

    const blockGroups = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(size => {
      return blocks
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
          if (grid.canFit(x, y, block)) {
            grid.mergeBlock(x, y, block);
            this.positionedBlocks.push({ block, x, y });
          }
        });
      });
    });

    smallerBlockGroups.forEach(blockGroup => {
      blockGroup.forEach(block => {
        points.forEach(({ x, y }) => {
          if (grid.canFit(x, y, block)) {
            grid.mergeBlock(x, y, block);
            this.positionedBlocks.push({ block, x, y });
          }
        });
      });
    });

    tinyBlockGroups.forEach(blockGroup => {
      blockGroup.forEach(block => {
        points.forEach(({ x, y }) => {
          if (grid.canFit(x, y, block)) {
            grid.mergeBlock(x, y, block);
            this.positionedBlocks.push({ block, x, y });
          }
        });
      });
    });
  }
}
