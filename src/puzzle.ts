import { Block } from "./primitives";
import { sizeOf, Shape } from "./shape";
import { arrayWith, randomInt } from "./util";
import { Grid } from "./grid";

const shapes: Shape[] = [
  [[1]],
  [[1], [1]],
  [
    [1, 1],
    [1, 0]
  ],
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
  [
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1]
  ],
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
  [
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 0, 0],
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 1, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ]
];

export class Puzzle {
  grid: Grid;
  blocks: Array<Block>;

  constructor(width: number, height: number) {
    this.reset(width, height);
  }

  reset(width: number, height: number) {
    this.grid = new Grid(width, height);
    this.blocks = [];
  }

  fillWith(shapes: Shape[]) {
    const width = this.grid.width;
    const height = this.grid.height;
    this.reset(width, height);

    shapes.sort((a, b) => sizeOf(a) - sizeOf(b));
    const groups = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(size =>
      shapes.filter(shape => sizeOf(shape) < size + 1 && sizeOf(shape) >= size)
    );

    groups.forEach(shapeGroup => {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          shapeGroup.forEach(shape => {
            if (this.grid.canFit(i, j, shape)) {
              this.grid.mergeShape(i, j, shape);
              this.blocks.push({ shape, x: i, y: j });
            }
          });
        }
      }
    });
  }
}
