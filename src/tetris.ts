import { randomInt } from "./util";
import { Block, PositionedBlock } from "./primitives";
import { Grid } from "./grid";

export const blocks: Block[] = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [0, 1],
    [1, 1],
    [0, 1]
  ],
  [
    [1, 1],
    [0, 1],
    [0, 1]
  ],
  [
    [1, 0],
    [1, 1],
    [0, 1]
  ],
  [[1, 1, 1, 1]]
];

class Arena {
  blocks: Array<PositionedBlock>;
  grid: Grid;
  width: number;

  constructor() {
    this.width = 5;
    this.grid = new Grid(5, 10);
    this.blocks = [];
  }

  addRandomBlock() {
    const n = randomInt(0, blocks.length);
    const block = blocks[n];
    const x = randomInt(0, this.width - blocks[0].length);
    const y = -block.length;
    this.blocks.push({ block, x, y });
  }

  tick() {
    this.blocks.forEach(block => {
      block.y += 1;
    });
  }

  draw() {
    return this.grid.slots.map((row, y) => {
      return row.map((gridValue, x) => {
        const value = 0;
        const finalValue = value || gridValue;
        return finalValue;
      });
    });
  }
}
/*
  const arena = new Arena();
  arena.addRandomBlock();
  arena.addRandomBlock();
  arena.addRandomBlock();
  [0, 1, 2, 3].forEach(n => {
    const step0 = arena.draw();
    console.log(step0);
    arena.tick();
  });
  */
