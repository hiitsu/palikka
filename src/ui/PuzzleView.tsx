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
  selectedBlockInfo: null | BlockInfo;
  blockSize: null | number;
  gridSize: Size;
  positionedBlocks: PositionedBlock[];
  proposedBlock: PositionedBlock | null;
  blockTrackers: BlockTracker[];
  isPuzzleComplete: boolean;
  state: StateMachineState;
  dragging: boolean;
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
  update: Partial<BlockTracker>,
  extraState: Partial<PuzzleState> = {}
): BlockTracker[] {
  const blockTrackers: BlockTracker[] = component.state.blockTrackers.slice().map(tracker => {
    if (tracker.blockId == blockId) {
      return { ...tracker, ...update };
    }
    return tracker;
  });
  component.setState({ ...(extraState as any), blockTrackers });
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

type StateMachineState = "noSelection" | "singleSelected" | "flipping";
type HammerEventType =
  | "handlePanStart"
  | "handlePan"
  | "handlePanEnd"
  | "handleTap"
  | "handleDoubleTap"
  | "handlePress";

type HammerEventHandler = (this: PuzzleComponent, ev: any) => void;
type States = {
  [key in StateMachineState]?: {
    [key in HammerEventType]?: HammerEventHandler;
  };
};

const PuzzleStates: States = {
  flipping: {
    handlePanEnd(ev: any) {
      const selectedBlockInfo = this.state.selectedBlockInfo!;
      const blockTracker = this.state.blockTrackers.find(t => t.blockId == selectedBlockInfo.blockId) as BlockTracker;
      const { block } = blockTracker;
      if (Math.abs(ev.deltaX) > 15)
        mutateBlockTrackers(this, selectedBlockInfo.blockId, { block: flipX(block) }, { state: "singleSelected" });
      if (Math.abs(ev.deltaY) > 15)
        mutateBlockTrackers(this, selectedBlockInfo.blockId, { block: flipY(block) }, { state: "singleSelected" });
    }
  },
  noSelection: {
    handleTap(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
        mutateBlockTrackers(
          this,
          selectedBlockInfo.blockId,
          { zIndex: maxZ + 1 },
          { selectedBlockInfo, state: "singleSelected" }
        );
      }
    },
    handlePanStart(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
        mutateBlockTrackers(
          this,
          selectedBlockInfo.blockId,
          {
            zIndex: maxZ + 1,
            isPlaced: false
          },
          {
            selectedBlockInfo,
            isPuzzleComplete: false,
            state: "singleSelected",
            dragging: true
          }
        );
      }
    },
    handlePress(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        this.setState({ selectedBlockInfo, state: "flipping" });
      }
    },
    handleDoubleTap(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        const blockTracker = this.state.blockTrackers.find(t => t.blockId == selectedBlockInfo.blockId);
        if (blockTracker) {
          const { block } = blockTracker;
          mutateBlockTrackers(this, selectedBlockInfo.blockId, {
            block: rotateClockWise90(block)
          });
        }
      }
    }
  },
  singleSelected: {
    handlePress(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        this.setState({ selectedBlockInfo, state: "flipping" });
      }
    },

    handleTap(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
        mutateBlockTrackers(this, selectedBlockInfo.blockId, { zIndex: maxZ + 1 }, { selectedBlockInfo });
      } else {
        this.setState({ state: "noSelection" });
      }
    },

    handleDoubleTap(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (selectedBlockInfo) {
        const blockTracker = this.state.blockTrackers.find(t => t.blockId == selectedBlockInfo.blockId);
        if (blockTracker) {
          const { block } = blockTracker;
          mutateBlockTrackers(this, selectedBlockInfo.blockId, {
            block: rotateClockWise90(block)
          });
        }
      }
    },

    handlePanStart(ev: any) {
      const selectedBlockInfo = blockInfo(ev.target);
      if (ev.pointers.length == 1 && selectedBlockInfo) {
        const maxZ = Math.max(...this.state.blockTrackers.map(t => t.zIndex));
        mutateBlockTrackers(
          this,
          selectedBlockInfo.blockId,
          {
            zIndex: maxZ + 1,
            isPlaced: false
          },
          {
            selectedBlockInfo,
            isPuzzleComplete: false,
            state: "singleSelected",
            dragging: true
          }
        );
      }
    },

    handlePan(ev: any) {
      if (
        ev.pointers.length > 1 ||
        !window ||
        !window.document ||
        !this.state.selectedBlockInfo ||
        !this.state.blockSize
      ) {
        return;
      }
      const selectedBlockInfo = this.state.selectedBlockInfo;
      const blockTrackers = mutateBlockTrackers(this, selectedBlockInfo.blockId, {
        screenX: ev.center.x - this.state.blockSize * selectedBlockInfo.xy.x,
        screenY: ev.center.y - this.state.blockSize * selectedBlockInfo.xy.y
      });
      const el = window.document.elementFromPoint(ev.center.x, ev.center.y);
      const xy = el && el.getAttribute("data-square-id");
      if (!xy) {
        console.log("warning could not trace grid xy for ", ev.center);
        this.setState({ proposedBlock: null });
        return;
      }
      const [panX, panY] = xy.split("-").map(s => parseInt(s));
      const x = panX - selectedBlockInfo.xy.x;
      const y = panY - selectedBlockInfo.xy.y;
      const tracker = blockTrackers.find(tracker => tracker.blockId == selectedBlockInfo.blockId) as BlockTracker;
      const proposedBlock = { x, y, block: tracker.block };
      const alreadyPositionedBlocks = blockTrackers
        .filter(tracker => tracker.blockId != selectedBlockInfo.blockId && tracker.isPlaced)
        .map(tracker => {
          return { x: tracker.gridX, y: tracker.gridY, block: tracker.block };
        });

      if (canFit(this.state.gridSize, alreadyPositionedBlocks as PositionedBlock[], proposedBlock)) {
        this.setState({ proposedBlock });
      } else {
        this.setState({ proposedBlock: null });
      }
    },

    handlePanEnd(ev: any) {
      if (!this.state.selectedBlockInfo || !window || !window.document) {
        return;
      }

      if (this.state.proposedBlock) {
        const dragInfo = this.state.selectedBlockInfo;
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
          this.setState({ isPuzzleComplete, blockTrackers });
          if (isPuzzleComplete) {
            this.props.onCompleted();
          }
        }
      }

      this.setState({
        selectedBlockInfo: null,
        proposedBlock: null,
        dragging: false
      });
    }
  }
};

export default class PuzzleComponent extends React.Component<PuzzleProps, PuzzleState> {
  el: HTMLDivElement | null;
  handlePanStart: (ev: any) => void;
  handlePan: (ev: any) => void;
  handlePanEnd: (ev: any) => void;
  handleTap: (ev: any) => void;
  handleDoubleTap: (ev: any) => void;
  handlePress: (ev: any) => void;
  constructor(props: PuzzleProps) {
    super(props);
    this.el = null;
    this.state = this.resetWith(props);

    this.handleHammerEvent = this.handleHammerEvent.bind(this);

    this.handlePanStart = this.handleHammerEvent.bind(this, "handlePanStart");
    this.handlePan = this.handleHammerEvent.bind(this, "handlePan");
    this.handlePanEnd = this.handleHammerEvent.bind(this, "handlePanEnd");
    this.handleTap = this.handleHammerEvent.bind(this, "handleTap");
    this.handleDoubleTap = this.handleHammerEvent.bind(this, "handleDoubleTap");
    this.handlePress = this.handleHammerEvent.bind(this, "handlePress");

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.handleSetElement = this.handleSetElement.bind(this);
  }

  resetWith(props: PuzzleProps): PuzzleState {
    return {
      state: "noSelection",
      dragging: false,
      selectedBlockInfo: null,
      isPuzzleComplete: false,
      gridSize: { w: 6, h: 6 },
      proposedBlock: null,
      positionedBlocks: [],
      blockSize: null,
      blockTrackers: props.blocks.map((block, index) => {
        return {
          ...screenPosition(index),
          zIndex: 10 + index + 2,
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
    const selectedBlockInfo = this.state.selectedBlockInfo;
    if (!selectedBlockInfo) return;
    const blockTracker = this.state.blockTrackers.find(t => t.blockId == selectedBlockInfo.blockId) as BlockTracker;
    const { block } = blockTracker;

    if (Math.abs(ev.deltaX) > 15) mutateBlockTrackers(this, selectedBlockInfo.blockId, { block: flipX(block) });
    if (Math.abs(ev.deltaY) > 15) mutateBlockTrackers(this, selectedBlockInfo.blockId, { block: flipY(block) });
  }

  handleKeyDown(ev: any) {
    const selectedBlockInfo = this.state.selectedBlockInfo;
    if (!selectedBlockInfo) return;
    const blockTracker = this.state.blockTrackers.find(t => t.blockId == selectedBlockInfo.blockId) as BlockTracker;
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
    mutateBlockTrackers(this, selectedBlockInfo.blockId, { block: flippedBlock });
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

  handleHammerEvent(eventType: HammerEventType, ev: any) {
    const state = PuzzleStates[this.state.state];
    const handler = state && state[eventType];
    console.log("handleHammerEvent", this.state.state, eventType, handler ? "handler:yes" : "handler:no");
    if (handler) {
      handler.call(this, ev);
    }
  }

  render() {
    return (
      <Hammer
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
            return <BlockView tracker={tracker} canSelect={!this.state.dragging} key={index} color={index} />;
          })}
          <GridView size={this.state.gridSize} highlight={this.state.proposedBlock || undefined} />
          {process.env.NODE_ENV != "production" && <div className="debug">{this.state.state}</div>}
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
