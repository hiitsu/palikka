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

export default class PuzzleComponent extends React.Component<
  {},
  {
    dragInfo: null | DragInfo;
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
      dragInfo: null,
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
    this.setState({ dragInfo: { blockId, blockX, blockY } });
    //console.log(ev.target);
  }

  handleMouseMove(ev) {
    if (!this.state.dragInfo) {
      return;
    }
    const block = this.state.positionedBlocks[this.state.dragInfo.blockId];
    block.y += ev.movementY;
    block.x += ev.movementX;
    this.setState({ drawCount: Date.now() });
    console.log(ev.target);
  }

  handleMouseUp(ev) {
    this.setState({ dragInfo: null });
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
              canSelect={!this.state.dragInfo}
              blockId={index}
              key={index}
              block={block}
              color={index}
            />
          );
        })}
        <GridView
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
