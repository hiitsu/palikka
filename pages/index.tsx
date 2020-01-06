import React from "react";
import { blocks, Puzzle, randomPuzzle } from "../src/puzzle";
import {
  allBlockVariations,
  sizeOf,
  flipX,
  flipY,
  rotateClockWise90
} from "../src/block";
import { Grid } from "../src/grid";
import { ColorGrid, Block } from "../src/primitives";
import { colors } from "../src/colors";
import { useState } from "react";

export function SlotComponent(props: {
  key: number | string;
  value: number;
  color: number;
  border?: boolean;
}) {
  const className = `slot slot-${props.value > 0 ? "handle" : "0"}`;
  return (
    <div
      key={props.key}
      className={className}
      style={{
        background:
          props.value == 0
            ? "transparent"
            : colors[props.color % colors.length],
        border: props.border ? "1px solid #999" : "0px"
      }}
    >
      <style jsx>{`
        .slot {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export function BlockComponent(props: {
  key?: number;
  block: Block;
  color: number;
}) {
  const [block, setBlock] = useState(props.block);
  return (
    <div
      key={props.key}
      className="block"
      onContextMenu={ev => {
        setBlock(rotateClockWise90(block));
        ev.preventDefault();
        return false;
      }}
    >
      {block.map((row, index) => {
        return (
          <div key={index} className="block-row">
            {row.map((value, index) =>
              SlotComponent({ value, color: props.color, key: index })
            )}
          </div>
        );
      })}
      <style jsx>{`
        .block {
          box-sizing: border-box;
          padding: 0;
          background-color: transparent;
          position: relative;
          display: inline-block;
          z-index: 10;
        }
        .block-row {
          box-sizing: border-box;
          height: 1cm;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export function GridComponent(props: { grid: ColorGrid }) {
  return (
    <div className="grid">
      {props.grid.map((row, index) => {
        return (
          <div key={index} className="grid-row">
            {row.map((value, index) =>
              SlotComponent({ value: 0, key: index, color: 1, border: true })
            )}
          </div>
        );
      })}
      <style jsx>{`
        .grid {
          position: absolute;
          box-sizing: border-box;
          padding: 0;
          background-color: #eee;
          z-index: -1;
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
        }
      `}</style>
    </div>
  );
}

class PuzzleComponent extends React.Component<{}, { puzzle: Puzzle }> {
  constructor(props) {
    super(props);

    this.state = {
      puzzle: randomPuzzle()
    };
  }

  render() {
    return (
      <div className="puzzle" style={{ position: "relative" }}>
        {this.state.puzzle.positionedBlocks.map((block, index) => {
          return <BlockComponent block={block.block} color={index} />;
        })}
        <GridComponent grid={this.state.puzzle.renderColorGrid()} />

        <style jsx global>
          {`
            body {
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </div>
    );
  }
}

export default PuzzleComponent;
