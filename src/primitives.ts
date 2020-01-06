export type ColorGrid = Array<Array<number>>;

export enum Slot {
  Empty = 0,
  Taken = 1
}

export type Block = Array<Array<Slot>>;

export type XY = { x: number; y: number };

export type PositionedBlock = {
  x: number;
  y: number;
  block: Block;
};
