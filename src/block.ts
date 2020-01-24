import { Block, XY } from "./primitives";

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

export const corners = (block: Block): { topLeft: XY; topRight: XY; bottomLeft: XY; bottomRight: XY } => {
  const w = block[0].length - 1;
  const h = block.length - 1;
  return {
    topLeft: { x: 0, y: 0 },
    topRight: { x: w, y: 0 },
    bottomLeft: { x: w, y: h },
    bottomRight: { x: 0, y: h }
  };
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
