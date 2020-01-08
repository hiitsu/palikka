import React, { SyntheticEvent } from "react";
import { Puzzle, randomPuzzle } from "../src/puzzle";
import { Grid } from "../src/grid";
import { ColorGrid, PositionedBlock, Slot } from "../src/primitives";
import { colors } from "../src/colors";

export function SlotComponent(props: {
  value: number;
  color: number;
  border?: boolean;
  slotId: string;
}) {
  const className = `slot slot-${props.value}`;
  return (
    <div
      data-slot-id={props.slotId}
      className={className}
      draggable="false"
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
          user-select: none;
        }
        .slot-0 {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export function BlockComponent(props: {
  blockId: number;
  block: PositionedBlock;
  color: number;
  canSelect: boolean;
}) {
  return (
    <div
      className="block"
      draggable="false"
      style={{
        left: props.block.x,
        top: props.block.y,
        pointerEvents: props.canSelect ? "auto" : "none"
      }}
    >
      {props.block.block.map((row, y) => {
        return (
          <div key={y} className="block-row" draggable="false">
            {row.map((value, x) => (
              <SlotComponent
                slotId={`${props.blockId}-${x}-${y}`}
                value={value}
                color={props.color}
                key={x}
              />
            ))}
          </div>
        );
      })}
      <style jsx>{`
        .block {
          cursor: move;
          box-sizing: border-box;
          padding: 0;
          background-color: transparent;
          position: absolute;
          display: inline-block;
          z-index: 10;
          user-select: none;
        }
        .block-row {
          box-sizing: border-box;
          height: 1cm;
          z-index: 10;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export function Square(props: { highlight?: boolean; squareId: string }) {
  return (
    <div
      data-square-id={props.squareId}
      className="square"
      draggable="false"
      style={{ background: props.highlight ? "red" : "transparent" }}
    >
      <style jsx>{`
        .square {
          width: 1cm;
          height: 1cm;
          display: inline-block;
          box-sizing: border-box;
          z-index: 1;
          border: 1px solid black;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export function GridComponent(props: {
  grid: Array<Array<any>>;
  highlight?: PositionedBlock;
}) {
  return (
    <div className="grid" draggable={false}>
      {props.grid.map((row, y) => {
        return (
          <div key={y} className="grid-row" draggable={false}>
            {row.map((value, x) => {
              const matchX =
                x >= props.highlight.x &&
                x < props.highlight.x + props.highlight.block[0].length;
              const matchY =
                y >= props.highlight.y &&
                y < props.highlight.y + props.highlight.block.length;
              const shouldHighlight =
                matchX &&
                matchY &&
                props.highlight.block[y - props.highlight.y][
                  x - props.highlight.x
                ] === Slot.Taken;
              return (
                <Square
                  key={x}
                  squareId={`${x}-${y}`}
                  highlight={shouldHighlight}
                />
              );
            })}
          </div>
        );
      })}
      <style jsx>{`
        .grid {
          position: absolute;
          box-sizing: border-box;
          padding: 0;
          background-color: #eee;
          z-index: 1;
          user-select: none;
        }
        .grid-row {
          box-sizing: border-box;
          height: 1cm;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

class PuzzleComponent extends React.Component<
  {},
  {
    draggedBlockId: null | number;
    puzzle: Puzzle;
    positionedBlocks: PositionedBlock[];
    drawCount: number;
  }
> {
  constructor(props) {
    super(props);

    const puzzle = randomPuzzle();

    this.state = {
      drawCount: 0,
      puzzle,
      draggedBlockId: null,
      positionedBlocks: puzzle.positionedBlocks.map(p => {
        return { ...p, x: 0, y: 0 };
      })
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(ev: any) {
    console.log(
      "elementFromPoint",
      window.document.elementFromPoint(ev.pageX, ev.pageY)
    );
    const slotId = ev.target.getAttribute("data-slot-id");
    if (!slotId) {
      return;
    }
    const [blockId, blockX, blockY] = slotId.split("-");
    this.setState({ draggedBlockId: blockId });
    //console.log(ev.target);
  }

  handleMouseMove(ev) {
    if (this.state.draggedBlockId != null) {
      const block = this.state.positionedBlocks[this.state.draggedBlockId];
      block.y += ev.movementY;
      block.x += ev.movementX;
      this.setState({ drawCount: Date.now() });
      console.log(ev.target);
    }
  }

  handleMouseUp(ev) {
    this.setState({ draggedBlockId: null });
  }

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
          return (
            <BlockComponent
              canSelect={this.state.draggedBlockId === null}
              blockId={index}
              key={index}
              block={block}
              color={index}
            />
          );
        })}
        <GridComponent
          grid={this.state.puzzle.grid.slots}
          highlight={{
            x: 0,
            y: 0,
            block: [
              [1, 1],
              [0, 1]
            ]
          }}
        />
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
