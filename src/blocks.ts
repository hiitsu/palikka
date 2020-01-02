import { Shape, XY, Grid, Block } from "./primitives";
import { arrayWith, randomInt } from "./util";

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

export const sizeOf = (shape: Shape): number => {
  return shape.reduce((memo, row) => {
    return memo + row.filter(column => column > 0).length;
  }, 0);
};

export const flipX = (shape: Shape): Shape => {
  return shape.map(row => row.slice().reverse());
};

export const flipY = (shape: Shape): Shape => {
  const w = shape[0].length;
  const columns: Shape = arrayWith(w, () => [] as number[]);
  shape.forEach(row => {
    row.forEach((value: number, i: number) => {
      columns[i].push(value);
    });
  });
  columns.forEach(column => {
    column.reverse();
  });
  return shape.map((row, i) => {
    return row.map((_, j: number) => {
      return columns[j][i];
    });
  });
};

export const rotateClockWise90 = (shape: Shape): Shape => {
  const w = shape[0].length;
  const columns: Shape = new Array(w).fill(1).map(_ => []);
  shape.forEach(row => {
    row.forEach((value: number, i: number) => {
      columns[i].push(value);
    });
  });
  columns.forEach(column => {
    column.reverse();
  });
  return columns;
};

export const shapeVariations = (shape: Shape): Shape[] => {
  const flips: Shape[] = [
    shape,
    flipX(shape),
    flipY(shape),
    flipX(flipY(shape))
  ];
  return flips.reduce((memo, flip) => {
    memo.push(flip);
    memo.push(rotateClockWise90(flip));
    memo.push(rotateClockWise90(rotateClockWise90(flip)));
    memo.push(rotateClockWise90(rotateClockWise90(rotateClockWise90(flip))));
    return memo;
  }, [] as Shape[]);
};

export const allShapeVariations = (shapes: Shape[]): Shape[] => {
  const stringifiedShapes: string[] = shapes
    .reduce((list, shape) => {
      return list.concat(shapeVariations(shape));
    }, [] as Shape[])
    .map(shape => JSON.stringify(shape));

  return [...new Set(stringifiedShapes)].map(s => JSON.parse(s));
};

export class PuzzleArea {
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
