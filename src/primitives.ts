export type Color = string | number | "transparent";

export enum Slot {
  Empty = 0,
  Taken = 1
}

export type Block = Array<Array<Slot>>;

export type Grid<T> = Array<Array<T>>;
export type ColorGrid = Grid<Color>;
export type AllocationGrid = Grid<Slot>;

export type XY = { x: number; y: number };
export type Size = { w: number; h: number };

export type PositionedBlock = {
  x: number;
  y: number;
  block: Block;
};

export type Puzzle = {
  id?: number;
  createdAt?: Date;
  width: number;
  height: number;
  positionedBlocks: PositionedBlock[];
  userId?: number;
  seconds?: number;
  puzzleId?: number;
};

export type Auth = { token: string; user: { id: number | string } };
