import React from "react";
import { Puzzle, randomPuzzle, blocks } from "../puzzle";
import { PositionedBlock, Block, XY } from "../primitives";
import { BlockView } from "./BlockView";
import { GridView } from "./GridView";
import { Grid } from "../grid";

type DragInfo = {
  blockId: number;
  blockX: number;
  blockY: number;
};

type GridInfo = {
  x: number;
  y: number;
};

type BlockTracker = {
  zIndex: number;
  screenX: number;
  screenY: number;
  block: Block;
  blockId: number;
};

export default class PuzzleComponent extends React.Component<
  { blocks: Block[] },
  {
    draggedBlockInfo: null | DragInfo;
    hoveredGridInfo: null | GridInfo;
    width: number;
    height: number;
    positionedBlocks: PositionedBlock[];
    highlightedPosition: PositionedBlock;
    drawCount: number;
    blockTrackers: BlockTracker[];
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      drawCount: 0,
      width: 6,
      height: 6,
      draggedBlockInfo: null,
      hoveredGridInfo: null,
      highlightedPosition: null,
      positionedBlocks: [],
      blockTrackers: props.blocks.map((block, index) => {
        return {
          screenX: 30 * index,
          screenY: 5 * index,
          zIndex: index + 2,
          block,
          blockId: index
        };
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
    const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
    const zIndices = this.state.zIndices.map((zIndex, index) =>
      index === blockId ? maxZ + 1 : zIndex
    );
    this.setState({ draggedBlockInfo: { blockId, blockX, blockY }, zIndices });
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
      //console.log("hoveredGridInfo", { x, y });
      this.setState({ hoveredGridInfo: { x, y } });
      const { blockX, blockY } = this.state.draggedBlockInfo;
      const fitX = x - blockX;
      const fitY = y - blockY;
      //if (canFit(fitX, fitY, block.block)) {
      if (
        new Grid(this.state.width, this.state.height).canFit(
          fitX,
          fitY,
          block.block
        )
      ) {
        const highlightedPosition = { x: fitX, y: fitY, block: block.block };
        this.setState({ highlightedPosition });
        console.log("highlightedPosition", highlightedPosition);
      } else {
        this.setState({ highlightedPosition: null });
      }
    }
    this.setState({ drawCount: Date.now() });
  }

  handleMouseUp(ev) {
    if (this.state.draggedBlockInfo && this.state.highlightedPosition) {
      const block = this.state.positionedBlocks[
        this.state.draggedBlockInfo.blockId
      ];
      //block.x = this.state.highlightedPosition.x;
      //block.y = this.state.highlightedPosition.y;
    }
    this.setState({
      draggedBlockInfo: null,
      hoveredGridInfo: null,
      highlightedPosition: null
    });
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
        {this.props.blocks.map((block, index) => {
          return (
            <BlockView
              zIndex={this.state.zIndices[index]}
              canSelect={!this.state.draggedBlockInfo}
              blockId={index}
              key={index}
              block={block}
              color={index}
            />
          );
        })}
        <GridView
          width={this.state.width}
          height={this.state.height}
          highlight={this.state.highlightedPosition}
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
