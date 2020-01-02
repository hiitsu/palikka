import { randomInt } from "./util";
import { Shape, XY, Grid } from "./primitives";

export const shapes: Shape[] = [
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

class Block {
  shape: Shape;
  position: XY;
  constructor(shape: Shape, position: XY) {
    this.shape = shape;
    this.position = position;
  }
  hasTileAt(xy: XY): boolean {
    return this.valueAt(xy) > 0;
  }
  valueAt(xy: XY): number {
    const _xy = { x: xy.x - this.position.x, y: xy.y - this.position.y };
    return this.shape[_xy.x]?.[_xy.y];
  }
}

class Arena {
  blocks: Array<Block>;
  grid: Grid;
  width: number;

  constructor() {
    this.width = 5;
    this.grid = new Grid(5, 10);
    this.blocks = [];
  }

  addRandomBlock() {
    const n = randomInt(0, shapes.length);
    const shape = shapes[n];
    const x = randomInt(0, this.width - shapes[0].length);
    const y = -shape.length;
    this.blocks.push(new Block(shape, { x, y }));
  }

  tick() {
    this.blocks.forEach(block => {
      block.position.y += 1;
    });
  }

  draw() {
    return this.grid.slots.map((row, y) => {
      return row.map((gridValue, x) => {
        const block = this.blocks.find(block => {
          return block.hasTileAt({ y, x });
        });
        const finalValue = block ? block.valueAt({ y, x }) : gridValue;
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
