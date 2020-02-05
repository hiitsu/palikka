import { Block, XY } from "./primitives";
import { randomInt } from "./util";

export const clone = (block: Block): Block => {
  return JSON.parse(JSON.stringify(block)) as Block;
};

export const sizeOf = (block: Block): number => {
  return block.reduce((memo, row) => {
    return memo + row.filter(column => column > 0).length;
  }, 0);
};

export const isEqual = (block: Block, another: Block): boolean => {
  const stringified = JSON.stringify(another);
  return [...blockVariations(block)].map(block => JSON.stringify(block)).findIndex(s => s == stringified) > -1;
};

export const corners = (block: Block, relativeTo: XY = { x: 0, y: 0 }): [XY, XY, XY, XY] => {
  const w = block[0].length - 1;
  const h = block.length - 1;
  return [
    { x: 0 - relativeTo.x, y: 0 - relativeTo.y },
    { x: w - relativeTo.x + 1, y: 0 - relativeTo.y },
    { x: w - relativeTo.x, y: h - relativeTo.y + 1 },
    { x: 0 - relativeTo.x + 1, y: h - relativeTo.y + 1 }
  ];
};

export const flipX = (block: Block): Block => {
  return block.map(row => row.slice().reverse());
};

export const flipY = (block: Block): Block => {
  const w = block[0].length;
  const columns: Block = Array(w)
    .fill(0)
    .map(() => []);
  block.forEach(row => {
    row.forEach((value: number, i: number) => {
      columns[i].push(value);
    });
  });
  columns.forEach(column => {
    column.reverse();
  });
  return block.map((row, i) => {
    return row.map((_, j: number) => {
      return columns[j][i];
    });
  });
};

export const rotateClockWise90 = (block: Block): Block => {
  const w = block[0].length;
  const columns: Block = Array(w)
    .fill(1)
    .map(_ => []);
  block.forEach(row => {
    row.forEach((value: number, i: number) => {
      columns[i].push(value);
    });
  });
  columns.forEach(column => {
    column.reverse();
  });
  return columns;
};

export const blockVariations = (block: Block): Block[] => {
  const flips: Block[] = [block, flipX(block), flipY(block), flipX(flipY(block))];
  const stringifiedBlocks = flips
    .reduce((memo, flip) => {
      memo.push(flip);
      memo.push(rotateClockWise90(flip));
      memo.push(rotateClockWise90(rotateClockWise90(flip)));
      memo.push(rotateClockWise90(rotateClockWise90(rotateClockWise90(flip))));
      return memo;
    }, [] as Block[])
    .map(block => JSON.stringify(block));

  return [...new Set(stringifiedBlocks)].map(s => JSON.parse(s));
};

export const allBlockVariations = (blocks: Block[]): Block[] => {
  const stringifiedBlocks: string[] = blocks
    .reduce((list, block) => {
      return list.concat(blockVariations(block));
    }, [] as Block[])
    .map(block => JSON.stringify(block));

  return [...new Set(stringifiedBlocks)].map(s => JSON.parse(s));
};

export const randomVariationOf = (block: Block): Block => {
  const variations = blockVariations(block);
  const num = randomInt(0, variations.length - 1);
  return variations[num];
};
