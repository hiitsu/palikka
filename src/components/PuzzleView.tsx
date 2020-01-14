import React from "react";
import Hammer from "react-hammerjs";
import { isComplete } from "../puzzle";
import { PositionedBlock, Block, Size, XY } from "../primitives";
import { BlockView } from "./BlockView";
import { GridView } from "./GridView";
import { flipX, flipY, rotateClockWise90 } from "../block";
import { canFit } from "../grid";
import { elementWidth } from "../dom";

type BlockInfo = {
  blockId: number;
  blockX: number;
  blockY: number;
};

export type BlockTracker = {
  zIndex: number;
  screenX: number;
  screenY: number;
  block: Block;
  blockId: number;
  isPlaced: boolean;
  gridX: number | null;
  gridY: number | null;
};

type PuzzleState = {
  panStartBlockId: null | number;
  blockSize: null | number;
  dragInfo: null | BlockInfo;
  hoverXY: null | XY;
  gridSize: Size;
  positionedBlocks: PositionedBlock[];
  proposedBlock: PositionedBlock | null;
  blockTrackers: BlockTracker[];
  isPuzzleComplete: boolean;
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

function blockInfo(el: Element): BlockInfo | null {
  const slotId = el.getAttribute("data-slot-id");
  if (!slotId) {
    return null;
  }
  const [blockId, blockX, blockY] = slotId.split("-").map((s: string) => parseInt(s));
  return { blockId, blockX, blockY };
}

export default class PuzzleComponent extends React.Component<PuzzleProps, PuzzleState> {
  constructor(props: PuzzleProps) {
    super(props);

    this.state = {
      panStartBlockId: null,
      isPuzzleComplete: false,
      gridSize: { w: 6, h: 6 },
      dragInfo: null,
      hoverXY: null,
      proposedBlock: null,
      positionedBlocks: [],
      blockSize: null,
      blockTrackers: props.blocks.map((block, index) => {
        const offsetY = Math.floor((120.0 * index) / 320.0);
        return {
          screenX: (120 * index) % 320,
          screenY: 10 + 120 * offsetY,
          zIndex: index + 2,
          block,
          blockId: index,
          isPlaced: false,
          gridX: null,
          gridY: null
        };
      })
    };

    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handleTap = this.handleTap.bind(this);
    this.handleDoubleTap = this.handleDoubleTap.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  componentDidMount() {
    const blockSize = elementWidth(".square");
    this.setState({ blockSize });
  }

  handleSwipe(ev: any) {
    console.log("handleSwipe", ev);
    const blockId = this.state.panStartBlockId;
    const blockTracker = this.state.blockTrackers.find(t => t.blockId == blockId);
    if (blockTracker) {
      const { block } = blockTracker;
      const flippedBlock = ev.direction == 2 || ev.direction == 4 ? flipX(block) : flipY(block);
      this.setState({
        blockTrackers: mutateBlockTrackers(this.state.blockTrackers, blockId as number, { block: flippedBlock })
      });
    }
  }

  handleTap(ev: any) {
    const info = blockInfo(ev.target);
    if (info) {
      const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
      this.setState({
        blockTrackers: mutateBlockTrackers(this.state.blockTrackers, info.blockId, { zIndex: maxZ + 1 })
      });
    }
  }

  handleDoubleTap(ev: any) {
    const info = blockInfo(ev.target);
    if (info) {
      const blockTracker = this.state.blockTrackers.find(t => t.blockId == info.blockId);
      if (blockTracker) {
        const { block } = blockTracker;
        this.setState({
          blockTrackers: mutateBlockTrackers(this.state.blockTrackers, info.blockId, {
            block: rotateClockWise90(block)
          })
        });
      }
    }
  }

  handlePanStart(ev: any) {
    const info = blockInfo(ev.target);
    if (info) {
      const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
      const blockTrackers = mutateBlockTrackers(this.state.blockTrackers, info.blockId, {
        zIndex: maxZ + 1,
        isPlaced: false
      });
      this.setState({
        panStartBlockId: info.blockId,
        isPuzzleComplete: false,
        dragInfo: { ...info },
        blockTrackers
      });
    }
  }

  handlePan(ev: any) {
    if (!this.state.dragInfo || !this.state.blockSize) {
      return;
    }
    const { blockId, blockX, blockY } = this.state.dragInfo;
    this.setState({
      blockTrackers: mutateBlockTrackers(this.state.blockTrackers, blockId, {
        screenX: ev.center.x - this.state.blockSize * blockX,
        screenY: ev.center.y - this.state.blockSize * blockY
      })
    });
    if (window && window.document) {
      const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
      if (!el) {
        this.setState({ proposedBlock: null });
        return;
      }
      const xy = el.getAttribute("data-square-id");
      if (!xy) {
        this.setState({ proposedBlock: null });
        return;
      }
      const [x, y] = xy.split("-").map(s => parseInt(s));
      this.setState({ hoverXY: { x, y } });
      const { blockX, blockY } = this.state.dragInfo;
      const fitX = x - blockX;
      const fitY = y - blockY;
      const tracker = this.state.blockTrackers.find(tracker => tracker.blockId == blockId);
      if (!tracker) {
        this.setState({ proposedBlock: null });
        return;
      }
      const proposedBlock = { x: fitX, y: fitY, block: tracker.block };
      const positionedBlocks = this.state.blockTrackers
        .filter(tracker => tracker.blockId != blockId && tracker.isPlaced)
        .map(tracker => {
          return { x: tracker.gridX, y: tracker.gridY, block: tracker.block };
        });
      if (canFit(this.state.gridSize, positionedBlocks as PositionedBlock[], proposedBlock)) {
        this.setState({ proposedBlock: proposedBlock });
      } else {
        this.setState({ proposedBlock: null });
      }
    }
  }

  handlePanEnd(ev: any) {
    if (this.state.dragInfo && this.state.proposedBlock) {
      if (window && window.document) {
        const { blockId, blockX, blockY } = this.state.dragInfo;
        const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
        const xy = el && el.getAttribute("data-square-id");
        if (xy) {
          const [x, y] = xy.split("-").map(s => parseInt(s));
          const squareTopLeft = document.querySelector(`[data-square-id="${x - blockX}-${y - blockY}"]`);
          const rect = (squareTopLeft as Element).getBoundingClientRect();
          const blockTrackers = mutateBlockTrackers(this.state.blockTrackers, blockId, {
            screenX: rect.left,
            screenY: rect.top,
            isPlaced: true,
            gridX: x - blockX,
            gridY: y - blockY
          });
          this.setState(
            {
              isPuzzleComplete: isComplete(
                this.state.gridSize,
                blockTrackers.map<PositionedBlock>(t => {
                  return {
                    x: t.gridX,
                    y: t.gridY,
                    block: t.block
                  } as PositionedBlock;
                })
              ),
              blockTrackers
            }
            //,() => console.log(this.state.blockTrackers)
          );
        }
      }
    }
    this.setState({
      dragInfo: null,
      hoverXY: null,
      proposedBlock: null
    });
  }

  render() {
    return (
      <Hammer
        direction={"DIRECTION_ALL"}
        onPanStart={this.handlePanStart}
        onPanEnd={this.handlePanEnd}
        onPan={this.handlePan}
        onDoubleTap={this.handleDoubleTap}
        onSwipe={this.handleSwipe}
        onTap={this.handleTap}
        onPress={() => console.log("PuzzleView:onPress")}
      >
        <div className="puzzle" style={{ position: "relative" }}>
          <label className="is-complete">Complete:{this.state.isPuzzleComplete ? "yes" : "no"}</label>
          {this.state.blockTrackers.map((tracker, index) => {
            return <BlockView tracker={tracker} canSelect={!this.state.dragInfo} key={index} color={index} />;
          })}
          <GridView
            width={this.state.gridSize.w}
            height={this.state.gridSize.h}
            highlight={this.state.proposedBlock || undefined}
          />
          <style jsx global>
            {`
              body {
                margin: 0;
                padding: 0;
                position: fixed;
                overflow: hidden;
                touch-action: manipulation;
                width: 100%;
                height: 100%;
              }
              #__next {
                width: 100%;
                height: 100%;
              }
              .puzzle {
                background: #efe;
                width: 100%;
                height: 100%;
                touch-action: manipulation;
              }
              .puzzle .is-complete {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 100000;
                width: 150px;
                text-align: center;
              }
            `}
          </style>
        </div>
      </Hammer>
    );
  }
}
