import React from "react";
import Hammer from "react-hammerjs";
import { isComplete } from "../puzzle";
import { PositionedBlock, Block, Size } from "../primitives";
import { BlockView } from "./BlockView";
import { GridView } from "./GridView";
import { flipX, flipY, rotateClockWise90 } from "../block";
import { canFit } from "../grid";
import { elementWidth, elementTopLeft, squareTopLeft } from "../dom";

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
  gridSize: Size;
  positionedBlocks: PositionedBlock[];
  proposedBlock: PositionedBlock | null;
  blockTrackers: BlockTracker[];
  isPuzzleComplete: boolean;
};

type PuzzleProps = {
  blocks: Block[];
  onCompleted: Function;
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

function mutateBlockTrackers(
  component: React.Component<PuzzleProps, PuzzleState>,
  blockId: number,
  update: Partial<BlockTracker>
): BlockTracker[] {
  const blockTrackers: BlockTracker[] = component.state.blockTrackers.slice().map(tracker => {
    if (tracker.blockId == blockId) {
      return { ...tracker, ...update };
    }
    return tracker;
  });
  component.setState({ blockTrackers });
  return blockTrackers;
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

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const blockSize = elementWidth(".square");
    this.setState({ blockSize });
    window && window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window && window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    this.state.blockTrackers.forEach(blockTracker => {
      if (!blockTracker.isPlaced) {
        return;
      }
      const { top, left } = squareTopLeft(blockTracker.gridX as number, blockTracker.gridY as number) as DOMRect;
      mutateBlockTrackers(this, blockTracker.blockId, { screenX: left, screenY: top });
    });
  }

  handleSwipe(ev: any) {
    console.log("handleSwipe", ev);
    if (ev.deltaTime > 200) {
      return;
    }
    const blockId = this.state.panStartBlockId;
    const blockTracker = this.state.blockTrackers.find(t => t.blockId == blockId);
    if (blockTracker) {
      const { block } = blockTracker;
      const flippedBlock = ev.direction == 2 || ev.direction == 4 ? flipX(block) : flipY(block);
      mutateBlockTrackers(this, blockId as number, { block: flippedBlock });
    }
  }

  handleTap(ev: any) {
    const info = blockInfo(ev.target);
    console.log("handleTap", info, ev.target);
    if (info) {
      const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
      mutateBlockTrackers(this, info.blockId, { zIndex: maxZ + 1 });
    }
  }

  handleDoubleTap(ev: any) {
    const info = blockInfo(ev.target);
    if (info) {
      const blockTracker = this.state.blockTrackers.find(t => t.blockId == info.blockId);
      if (blockTracker) {
        const { block } = blockTracker;
        mutateBlockTrackers(this, info.blockId, {
          block: rotateClockWise90(block)
        });
      }
    }
  }

  handlePanStart(ev: any) {
    const info = blockInfo(ev.target);
    console.log("handlePanStart", info, ev.target);
    if (info) {
      const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
      mutateBlockTrackers(this, info.blockId, {
        zIndex: maxZ + 1,
        isPlaced: false
      });
      this.setState({
        panStartBlockId: info.blockId,
        isPuzzleComplete: false,
        dragInfo: { ...info }
      });
    }
  }

  handlePan(ev: any) {
    if (!window || !window.document || !this.state.dragInfo || !this.state.blockSize) {
      return;
    }
    const { blockId, blockX, blockY } = this.state.dragInfo;
    const blockTrackers = mutateBlockTrackers(this, blockId, {
      screenX: ev.center.x - this.state.blockSize * blockX,
      screenY: ev.center.y - this.state.blockSize * blockY
    });
    const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
    const xy = el && el.getAttribute("data-square-id");
    if (!xy) {
      this.setState({ proposedBlock: null });
      return;
    }
    const [panX, panY] = xy.split("-").map(s => parseInt(s));
    const x = panX - blockX;
    const y = panY - blockY;
    const tracker = blockTrackers.find(tracker => tracker.blockId == blockId) as BlockTracker;
    const proposedBlock = { x, y, block: tracker.block };
    const alreadyPositionedBlocks = blockTrackers
      .filter(tracker => tracker.blockId != blockId && tracker.isPlaced)
      .map(tracker => {
        return { x: tracker.gridX, y: tracker.gridY, block: tracker.block };
      });

    if (canFit(this.state.gridSize, alreadyPositionedBlocks as PositionedBlock[], proposedBlock)) {
      this.setState({ proposedBlock });
    } else {
      this.setState({ proposedBlock: null });
    }
  }

  handlePanEnd(ev: any) {
    if (!this.state.dragInfo || !window || !window.document) {
      return;
    }

    if (this.state.proposedBlock) {
      const { blockId, blockX, blockY } = this.state.dragInfo;
      const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
      const xy = el && el.getAttribute("data-square-id");
      if (xy) {
        const [x, y] = xy.split("-").map(s => parseInt(s));
        const rect = squareTopLeft(x - blockX, y - blockY) as DOMRect;
        const blockTrackers = mutateBlockTrackers(this, blockId, {
          screenX: rect.left,
          screenY: rect.top,
          isPlaced: true,
          gridX: x - blockX,
          gridY: y - blockY
        });
        const isPuzzleComplete = isComplete(
          this.state.gridSize,
          blockTrackers.map<PositionedBlock>(t => {
            return {
              x: t.gridX,
              y: t.gridY,
              block: t.block
            } as PositionedBlock;
          })
        );
        this.setState({ isPuzzleComplete, blockTrackers }, () => console.log(this.state.blockTrackers));
        if (isPuzzleComplete) {
          this.props.onCompleted();
        }
      }
    }

    this.setState({
      dragInfo: null,
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
          {this.state.blockTrackers.map((tracker, index) => {
            return <BlockView tracker={tracker} canSelect={!this.state.dragInfo} key={index} color={index} />;
          })}
          <GridView size={this.state.gridSize} highlight={this.state.proposedBlock || undefined} />
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
                width: 100%;
                height: 100%;
                touch-action: manipulation;
              }
            `}
          </style>
        </div>
      </Hammer>
    );
  }
}
