import React, { DOMElement } from "react";
import Hammer from "react-hammerjs";
import { isComplete } from "../puzzle";
import { PositionedBlock, Block, Size, XY } from "../primitives";
import { BlockView } from "./BlockView";
import { GridView } from "./GridView";
import { flipX, flipY, rotateClockWise90, corners } from "../block";
import { canFit } from "../grid";
import { elementWidth, elementTopLeft, squareTopLeft, isPointInside, elementOffset } from "../dom";

type BlockInfo = {
  blockId: number;
  xy: XY;
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
  pressedBlockId: null | number;
  positionedBlocks: PositionedBlock[];
  proposedBlock: PositionedBlock | null;
  blockTrackers: BlockTracker[];
  isPuzzleComplete: boolean;
  debug?: any;
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
  const [blockId, x, y] = slotId.split("-").map((s: string) => parseInt(s));
  return { blockId, xy: { x, y } };
}

function screenPosition(index: number): { screenX: number; screenY: number } {
  const offsetY = Math.floor((120.0 * index) / 320.0);
  return {
    screenX: (120 * index) % 320,
    screenY: 10 + 120 * offsetY
  };
}

/*
function isOutside(component: PuzzleComponent, screenXY: XY): boolean {
  const dragInfo = component.state.dragInfo as BlockInfo;
  const tracker = component.state.blockTrackers.find(tracker => tracker.blockId == dragInfo.blockId) as BlockTracker;
  const screenPixelCorners = corners(tracker.block, dragInfo.xy).map(xy => {});
  const el = window.document.elementFromPoint(screenXY.x, screenXY.y);
  //console.log("elementOffset", elementOffset(el as HTMLElement));
  //console.log("element x", ev.center.x - elementOffset(el as HTMLElement).left);
  //console.log("element y", ev.center.y - elementOffset(el as HTMLElement).top);
  return false;
}
*/

export default class PuzzleComponent extends React.Component<PuzzleProps, PuzzleState> {
  el: HTMLDivElement | null;
  constructor(props: PuzzleProps) {
    super(props);
    this.el = null;
    this.state = this.resetWith(props);

    this.handlePanStart = this.handlePanStart.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handlePanEnd = this.handlePanEnd.bind(this);
    this.handleTap = this.handleTap.bind(this);
    this.handleDoubleTap = this.handleDoubleTap.bind(this);
    this.handlePress = this.handlePress.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.handleSetElement = this.handleSetElement.bind(this);
  }

  resetWith(props: PuzzleProps): PuzzleState {
    return {
      pressedBlockId: null,
      panStartBlockId: null,
      isPuzzleComplete: false,
      gridSize: { w: 6, h: 6 },
      dragInfo: null,
      proposedBlock: null,
      positionedBlocks: [],
      blockSize: null,
      blockTrackers: props.blocks.map((block, index) => {
        return {
          ...screenPosition(index),
          zIndex: index + 2,
          block,
          blockId: index,
          isPlaced: false,
          gridX: null,
          gridY: null
        };
      })
    };
  }

  componentDidMount() {
    const blockSize = elementWidth(".square");
    this.setState({ blockSize });
    window && window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps: PuzzleProps, prevState: PuzzleState) {
    if (prevProps.blocks !== this.props.blocks) {
      this.setState(this.resetWith(this.props));
    }
  }

  componentWillUnmount() {
    window && window.removeEventListener("resize", this.handleResize);
  }

  handleWheel(ev: any) {
    console.log("handleWheel", ev.deltaX, ev.deltaY);
    const blockId = this.state.panStartBlockId;
    if (!blockId) return;
    const blockTracker = this.state.blockTrackers.find(t => t.blockId == blockId) as BlockTracker;
    const { block } = blockTracker;

    if (Math.abs(ev.deltaX) > 15) mutateBlockTrackers(this, blockId as number, { block: flipX(block) });
    if (Math.abs(ev.deltaY) > 15) mutateBlockTrackers(this, blockId as number, { block: flipY(block) });
  }

  handleKeyDown(ev: any) {
    const blockId = this.state.panStartBlockId;
    if (!blockId) return;
    const blockTracker = this.state.blockTrackers.find(t => t.blockId == blockId) as BlockTracker;
    const { block } = blockTracker;
    let flippedBlock;
    switch (ev.keyCode) {
      case 65:
      case 68:
      case 39:
      case 37:
        flippedBlock = flipX(block);
        break;
      case 87:
      case 83:
      case 38:
      case 40:
        flippedBlock = flipY(block);
        break;
      default:
        break;
    }
    mutateBlockTrackers(this, blockId as number, { block: flippedBlock });
  }

  handleSetElement(el: HTMLDivElement) {
    this.el = el;
  }

  handleResize() {
    const blockTrackers = this.state.blockTrackers.map((blockTracker, index) => {
      const naturalPosition = screenPosition(index);
      if (!blockTracker.isPlaced) {
        return { ...blockTracker, ...naturalPosition };
      }
      const { top, left } = squareTopLeft(blockTracker.gridX as number, blockTracker.gridY as number) as DOMRect;
      return { ...blockTracker, screenX: left, screenY: top };
    });
    this.setState({ blockTrackers });
  }

  handlePress(ev: any) {
    const info = blockInfo(ev.target);
    console.log("handlePress", info, ev.target);
    if (info) {
      this.setState({ pressedBlockId: info.blockId });
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
    console.log("handlePanStart", ev, info);
    if (ev.pointers.length == 1 && info) {
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
    this.setState({
      debug: {
        velocityX: Math.floor((ev.velocityX as number) * 1000),
        velocityY: Math.floor((ev.velocityY as number) * 1000),
        devicePixelRatio: window.devicePixelRatio
      }
    });
    if (ev.pointers.length > 1 || !window || !window.document || !this.state.dragInfo || !this.state.blockSize) {
      return;
    }
    const dragInfo = this.state.dragInfo;
    const blockTrackers = mutateBlockTrackers(this, dragInfo.blockId, {
      screenX: ev.center.x - this.state.blockSize * dragInfo.xy.x,
      screenY: ev.center.y - this.state.blockSize * dragInfo.xy.y
    });
    const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
    //console.log("elementOffset", elementOffset(el as HTMLElement));
    //console.log("element x", ev.center.x - elementOffset(el as HTMLElement).left);
    //console.log("element y", ev.center.y - elementOffset(el as HTMLElement).top);
    const xy = el && el.getAttribute("data-square-id");
    if (!xy) {
      this.setState({ proposedBlock: null });
      return;
    }
    const [panX, panY] = xy.split("-").map(s => parseInt(s));
    const x = panX - dragInfo.xy.x;
    const y = panY - dragInfo.xy.y;
    const tracker = blockTrackers.find(tracker => tracker.blockId == dragInfo.blockId) as BlockTracker;
    const proposedBlock = { x, y, block: tracker.block };
    const alreadyPositionedBlocks = blockTrackers
      .filter(tracker => tracker.blockId != dragInfo.blockId && tracker.isPlaced)
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
      const dragInfo = this.state.dragInfo;
      const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
      const xy = el && el.getAttribute("data-square-id");
      if (xy) {
        const [x, y] = xy.split("-").map(s => parseInt(s));
        const rect = squareTopLeft(x - dragInfo.xy.x, y - dragInfo.xy.y) as DOMRect;
        const blockTrackers = mutateBlockTrackers(this, dragInfo.blockId, {
          screenX: rect.left,
          screenY: rect.top,
          isPlaced: true,
          gridX: x - dragInfo.xy.x,
          gridY: y - dragInfo.xy.y
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
        //direction={"DIRECTION_ALL"}
        onPanStart={this.handlePanStart}
        onPanEnd={this.handlePanEnd}
        onPan={this.handlePan}
        onDoubleTap={this.handleDoubleTap}
        onTap={this.handleTap}
        onPress={this.handlePress}
      >
        <div
          tabIndex={0}
          onWheel={this.handleWheel}
          onKeyDown={this.handleKeyDown}
          ref={this.handleSetElement}
          className="puzzle"
          style={{ position: "relative" }}
        >
          {this.state.blockTrackers.map((tracker, index) => {
            return <BlockView tracker={tracker} canSelect={!this.state.dragInfo} key={index} color={index} />;
          })}
          <GridView size={this.state.gridSize} highlight={this.state.proposedBlock || undefined} />
          <div className="debug">{JSON.stringify(this.state.debug || null)}</div>
          <style jsx global>
            {`
              html,
              body {
                margin: 0;
                padding: 0;
                position: fixed;
                overflow: hidden;
                width: 100%;
                height: 100%;
                user-zoom: fixed;
              }
              #__next {
                width: 100%;
                height: 100%;
              }
              * {
                user-select: none;
                touch-action: manipulation;
              }
              .debug {
                position:absolute;
                top:4px;
                left4px;
              }
              .puzzle {
                width: 100%;
                height: 100%;
              }
            `}
          </style>
        </div>
      </Hammer>
    );
  }
}
