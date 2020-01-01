export const arrayWith = (size: number, valueOrPredicate: any): Array<any> => {
  if (typeof valueOrPredicate === "number")
    return new Array(size).fill(valueOrPredicate);
  const arr = [];
  for (let i = 0; i < size; i++) arr.push(valueOrPredicate(i));
  return arr;
};

export type Shape = Array<Array<number>>;
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

type XY = { x: number; y: number };

export const randomInt = (from: number, to: number): number =>
  from + Math.floor(Math.random() * to - from);

export const randomGrid = (min: number, max: number): Grid => {
  const w = randomInt(min, max);
  const h = randomInt(min, max);
  return arrayWith(h, 1).map(() => arrayWith(w, 1));
};

export const gridWith = (w: number, h: number): Grid => {
  return arrayWith(h, 1).map(() => arrayWith(w, 1));
};

export const mergeGrids = (target: Grid, source: Grid): Grid => {
  return [];
};

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

type Grid = Array<Array<number>>;

class Area {
  grid: Grid;
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

class Arena {
  blocks: Array<Block>;
  grid: Grid;
  width: number;

  constructor() {
    this.width = 5;
    this.grid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => [0, 0, 0, 0, 0]);
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

  draw(): Grid {
    return this.grid.map((row, y) => {
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
