import { Block, Slot } from "./primitives";
import { sizeOf, Shape } from "./shape";
import { Grid } from "./grid";
import { arrayWith, arrayShuffle, arrayOfPoints, randomInt } from "./util";

export const shapes: Shape[] = [
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
    const points = arrayShuffle(arrayOfPoints(width, height));
    const grid = new Grid(width, height);

    const shapeGroups = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(size => {
      return shapes
        .sort((a, b) => sizeOf(b) - sizeOf(a))
        .filter(shape => sizeOf(shape) < size + 1 && sizeOf(shape) >= size);
    });

    const biggerShapeGroups = shapeGroups.slice(0, 3);
    const smallerShapeGroups = shapeGroups.slice(3, 6);
    const tinyShapeGroups = shapeGroups.slice(6, 9);

    points.forEach(({ x, y }) => {
      biggerShapeGroups.forEach(shapeGroup => {
        const shuffledShapeGroup = arrayShuffle(shapeGroup);
        shuffledShapeGroup.forEach(shape => {
          if (grid.canFit(x, y, shape)) {
            grid.mergeShape(x, y, shape);
            this.blocks.push({ shape, x, y });
          }
        });
      });
    });

    smallerShapeGroups.forEach(shapeGroup => {
      shapeGroup.forEach(shape => {
        points.forEach(({ x, y }) => {
          if (grid.canFit(x, y, shape)) {
            grid.mergeShape(x, y, shape);
            this.blocks.push({ shape, x, y });
          }
        });
      });
    });

    tinyShapeGroups.forEach(shapeGroup => {
      shapeGroup.forEach(shape => {
        points.forEach(({ x, y }) => {
          if (grid.canFit(x, y, shape)) {
            grid.mergeShape(x, y, shape);
            this.blocks.push({ shape, x, y });
          }
        });
      });
    });
  }
}
