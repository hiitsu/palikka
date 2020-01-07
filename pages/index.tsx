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
import { ColorGrid, Block, PositionedBlock } from "../src/primitives";
import { colors } from "../src/colors";
import { useState } from "react";

export function SlotComponent(props: {
  value: number;
  color: number;
  border?: boolean;
  //slotId: string;
}) {
  const className = `slot slot-${props.value}`;
  return (
    <div
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
        .slot-0 {
          //pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export function BlockComponent(props: {
  block: PositionedBlock;
  color: number;
}) {
  return (
    <div className="block" style={{ left: props.block.x, top: props.block.y }}>
      {props.block.block.map((row, index) => {
        return (
          <div key={index} className="block-row">
            {row.map((value, index) => (
              <SlotComponent
                value={props.color + 1}
                color={props.color}
                key={index}
              />
            ))}
          </div>
        );
      })}
      <style jsx>{`
        .block {
          box-sizing: border-box;
          padding: 0;
          background-color: transparent;
          position: absolute;
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
            {row.map((value, index) => (
              <SlotComponent key={index} value={0} color={1} border={true} />
            ))}
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

class PuzzleComponent extends React.Component<
  {},
  { puzzle: Puzzle; positionedBlocks: PositionedBlock[]; drawCount: number }
> {
  constructor(props) {
    super(props);

    const puzzle = randomPuzzle();

    this.state = {
      drawCount: 0,
      puzzle,
      positionedBlocks: puzzle.positionedBlocks.map(p => {
        return { ...p, x: 0, y: 0 };
      })
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(ev) {}

  handleMouseMove(ev) {
    this.state.positionedBlocks[0].x += ev.movementX;
    this.state.positionedBlocks[0].y += ev.movementY;
    this.setState({ drawCount: Date.now() });
  }

  handleMouseUp(ev) {}

  render() {
    return (
      <div
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        className="puzzle"
        style={{ position: "relative" }}
      >
        {this.state.positionedBlocks.map((block, index) => {
          return <BlockComponent key={index} block={block} color={index} />;
        })}

        <style jsx global>
          {`
            body {
              margin: 0;
              padding: 0;
            }
            .puzzle {
              background: #efe;
              width: 480px;
              height: 480px;
            }
          `}
        </style>
      </div>
    );
  }
}

export default PuzzleComponent;
