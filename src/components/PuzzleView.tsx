import React from "react";
import Hammer from "react-hammerjs";
import { Puzzle, randomPuzzle, blocks } from "../puzzle";
import { PositionedBlock, Block, XY } from "../primitives";
import { BlockView } from "./BlockView";
import { GridView } from "./GridView";
import { Grid } from "../grid";
import { flipX, flipY, rotateClockWise90 } from "../block";

type DragInfo = {
  blockId: number;
  blockX: number;
  blockY: number;
};

type GridInfo = {
  x: number;
  y: number;
};

export type BlockTracker = {
  zIndex: number;
  screenX: number;
  screenY: number;
  block: Block;
  blockId: number;
};

type PuzzleState = {
  blockSize: null | number;
  draggedBlockInfo: null | DragInfo;
  hoveredGridInfo: null | GridInfo;
  width: number;
  height: number;
  positionedBlocks: PositionedBlock[];
  highlightedPosition: PositionedBlock;
  drawCount: number;
  blockTrackers: BlockTracker[];
};

type PuzzleProps = {
  blocks: Block[];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

function mutateBlockTrackers(trackers: BlockTracker[], blockId: number, update: Partial<BlockTracker>): BlockTracker[] {
  return trackers.slice().map(tracker => {
    if (tracker.blockId == blockId) {
      return { ...tracker, ...update };
    }
    return tracker;
  });
}

export default class PuzzleComponent extends React.Component<PuzzleProps, PuzzleState> {
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
      blockSize: null,
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

    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handleDoubleTap = this.handleDoubleTap.bind(this);
  }

  componentDidMount() {
    const { width: blockSize } = document.querySelector(".square").getBoundingClientRect();

    this.setState({ blockSize });
  }

  handleDoubleTap(ev) {
    const slotId = ev.target.getAttribute("data-slot-id");
    if (!slotId) {
      return;
    }
    const [blockId] = slotId.split("-").map(s => parseInt(s));
    const { block } = this.state.blockTrackers.find(t => blockId == t.blockId);
    this.setState({
      blockTrackers: mutateBlockTrackers(this.state.blockTrackers, blockId, { block: rotateClockWise90(block) })
    });
  }

  handlePanStart(ev: any) {
    console.log("handlePanStart", ev);
    const slotId = ev.target.getAttribute("data-slot-id");
    if (!slotId) {
      return;
    }
    const [blockId, blockX, blockY] = slotId.split("-").map(s => parseInt(s));
    const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
    const blockTrackers = mutateBlockTrackers(this.state.blockTrackers, blockId, { zIndex: maxZ + 1 });
    this.setState({ draggedBlockInfo: { blockId, blockX, blockY }, blockTrackers });
    //console.log(ev.target);
  }

  handlePan(ev) {
    console.log("handlePan", ev);
    if (!this.state.draggedBlockInfo) {
      return;
    }
    const { blockId, blockX, blockY } = this.state.draggedBlockInfo;
    const { screenX, screenY, block } = this.state.blockTrackers[blockId];
    this.setState({
      blockTrackers: mutateBlockTrackers(this.state.blockTrackers, blockId, {
        screenX: ev.center.x - this.state.blockSize * blockX,
        screenY: ev.center.y - this.state.blockSize * blockY
      })
    });
    //console.log(ev.target);
    if (window && window.document) {
      const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
      const xy = el.getAttribute("data-square-id");
      if (!xy) {
        this.setState({ highlightedPosition: null });
        return;
      }
      const [x, y] = xy.split("-").map(s => parseInt(s));
      //console.log("hoveredGridInfo", { x, y });
      this.setState({ hoveredGridInfo: { x, y } });
      const { blockX, blockY } = this.state.draggedBlockInfo;
      const fitX = x - blockX;
      const fitY = y - blockY;
      const tracker = this.state.blockTrackers.find(tracker => tracker.blockId == blockId);
      //if (canFit(fitX, fitY, block.block)) {
      if (new Grid(this.state.width, this.state.height).canFit(fitX, fitY, tracker.block)) {
        const highlightedPosition = { x: fitX, y: fitY, block: tracker.block };
        this.setState({ highlightedPosition });
        console.log("highlightedPosition", highlightedPosition);
      } else {
        this.setState({ highlightedPosition: null });
      }
    }
    this.setState({ drawCount: Date.now() });
  }

  handlePanEnd(ev) {
    console.log("handlePanEnd", ev);
    if (this.state.draggedBlockInfo && this.state.highlightedPosition) {
      if (window && window.document) {
        const { blockId, blockX, blockY } = this.state.draggedBlockInfo;
        const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
        const xy = el.getAttribute("data-square-id");
        if (xy) {
          const [x, y] = xy.split("-").map(s => parseInt(s));
          const squareTopLeft = document.querySelector(`[data-square-id="${x - blockX}-${y - blockY}"]`);
          const rect = squareTopLeft.getBoundingClientRect();
          this.setState({
            blockTrackers: mutateBlockTrackers(this.state.blockTrackers, blockId, {
              screenX: rect.left,
              screenY: rect.top
            })
          });
        }
      }
    }
    this.setState({
      draggedBlockInfo: null,
      hoveredGridInfo: null,
      highlightedPosition: null
    });
  }

  render() {
    return (
      <Hammer
        onPanStart={this.handlePanStart}
        onPanEnd={this.handlePanEnd}
        onPan={this.handlePan}
        onDoubleTap={this.handleDoubleTap}
        onSwipe={() => console.log("PuzzleView:onSwipe")}
        onTap={() => console.log("PuzzleView:onTap")}
        onPress={() => console.log("PuzzleView:onPress")}
      >
        <div className="puzzle" style={{ position: "relative" }}>
          {this.state.blockTrackers.map((tracker, index) => {
            return <BlockView tracker={tracker} canSelect={!this.state.draggedBlockInfo} key={index} color={index} />;
          })}
          <GridView width={this.state.width} height={this.state.height} highlight={this.state.highlightedPosition} />
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
      </Hammer>
    );
  }
}
