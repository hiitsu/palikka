import React from "react";
import { Puzzle, randomPuzzle } from "../puzzle";
import { PositionedBlock } from "../primitives";
import { BlockView } from "./BlockView";
import { GridView } from "./GridView";

type DragInfo = {
  blockId: number;
  blockX: number;
  blockY: number;
};

type GridInfo = {
  x: number;
  y: number;
};

export default class PuzzleComponent extends React.Component<
  {},
  {
    draggedBlockInfo: null | DragInfo;
    hoveredGridInfo: null | GridInfo;
    puzzle: Puzzle;
    positionedBlocks: PositionedBlock[];
    drawCount: number;
  }
> {
  constructor(props) {
    super(props);

    const puzzle = randomPuzzle();
    console.log(puzzle);
    this.state = {
      drawCount: 0,
      puzzle,
      draggedBlockInfo: null,
      hoveredGridInfo: null,
      positionedBlocks: puzzle.positionedBlocks.map(p => {
        return { ...p, x: 0, y: 0 };
      })
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(ev: any) {
    const slotId = ev.target.getAttribute("data-slot-id");
    if (!slotId) {
      return;
    }
    const [blockId, blockX, blockY] = slotId.split("-").map(s => parseInt(s));
    this.setState({ draggedBlockInfo: { blockId, blockX, blockY } });
    //console.log(ev.target);
  }

  handleMouseMove(ev) {
    if (!this.state.draggedBlockInfo) {
      return;
    }
    const block = this.state.positionedBlocks[
      this.state.draggedBlockInfo.blockId
    ];
    block.y += ev.movementY;
    block.x += ev.movementX;
    //console.log(ev.target);
    if (window && window.document) {
      const el = window.document.elementFromPoint(ev.pageX, ev.pageY);
      const xy = el.getAttribute("data-square-id");
      if (!xy) {
        return;
      }
      const [x, y] = xy.split("-").map(s => parseInt(s));
      console.log("hoveredGridInfo", { x, y });
      this.setState({ hoveredGridInfo: { x, y } });
    }
    this.setState({ drawCount: Date.now() });
  }

  handleMouseUp(ev) {
    this.setState({ draggedBlockInfo: null, hoveredGridInfo: null });
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
            <BlockView
              canSelect={!this.state.draggedBlockInfo}
              blockId={index}
              key={index}
              block={block}
              color={index}
            />
          );
        })}
        <GridView
          width={this.state.puzzle.width}
          height={this.state.puzzle.height}
          highlight={
            this.state.hoveredGridInfo
              ? {
                  x: this.state.hoveredGridInfo.x,
                  y: this.state.hoveredGridInfo.y,
                  block: [[1]]
                }
              : null
          }
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
