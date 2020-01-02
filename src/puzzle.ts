import { Block, Slot } from "./primitives";
import { sizeOf, Shape } from "./shape";
import { Grid } from "./grid";
import { arrayWith } from "./util";

export const shapes: Shape[] = [
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
  [[1, 1, 1]],
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

  renderColorGrid() {
    const w = this.grid.width;
    const h = this.grid.height;
    const colorGrid: number[][] = arrayWith(h, 1).map(() => arrayWith(w, 0));
    this.blocks.forEach((block, index) => {
      const shape = block.shape;
      const shapeWidth = shape[0].length;
      const shapeHeight = shape.length;
      for (let i = 0; i < shapeWidth; i++) {
        for (let j = 0; j < shapeHeight; j++) {
          const isInside =
            colorGrid[block.y + j] &&
            typeof colorGrid[block.y + j][block.x + i] === "number";
          const isTaken = shape[j][i] === Slot.Taken;
          if (isInside && isTaken) {
            colorGrid[block.y + j][block.x + i] = index + 1;
          }
        }
      }
    });
    return colorGrid;
  }

  fillWith(shapes: Shape[]) {
    const width = this.grid.width;
    const height = this.grid.height;
    this.reset(width, height);

    shapes.sort((a, b) => sizeOf(a) - sizeOf(b));
    const groups = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(size =>
      shapes.filter(shape => sizeOf(shape) < size + 1 && sizeOf(shape) >= size)
    );

    const grid = new Grid(width, height);
    groups.forEach(shapeGroup => {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          shapeGroup.forEach(shape => {
            if (grid.canFit(i, j, shape)) {
              grid.mergeShape(i, j, shape);
              this.blocks.push({ shape, x: i, y: j });
            }
          });
        }
      }
    });
  }
}
