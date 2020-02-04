import React from "react";
import { Spinner } from "./Spinner";
import PuzzleView from "./PuzzleView";

import { Block } from "../primitives";

import { randomPuzzle } from "../puzzle";
import Button from "./Button";

type Props = {};
type State = { completed: boolean; blocks: Block[] | null; loading: boolean };

export default class GameControllerView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      blocks: null,
      completed: false,
      loading: true
    };

    this.handleCompleted = this.handleCompleted.bind(this);
    this.handlePlayAgain = this.handlePlayAgain.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const blocks = randomPuzzle({ w: 6, h: 6 }).positionedBlocks.map(positionedBlock => positionedBlock.block);
      this.setState({ blocks, loading: false, completed: false });
    }, 500);
  }

  handleCompleted() {
    this.setState({ completed: true, loading: false });
  }

  handlePlayAgain() {
    this.setState({ loading: true, completed: false });
    setTimeout(() => {
      const blocks = randomPuzzle({ w: 6, h: 6 }).positionedBlocks.map(positionedBlock => positionedBlock.block);
      this.setState({ blocks, loading: false });
    }, 500);
  }

  render() {
    return (
      <div className="game-controller-view">
        {this.state.completed && !this.state.loading && (
          <div className="menu">
            <Button text={"Play Again"} onClick={this.handlePlayAgain} />
          </div>
        )}
        {this.renderPuzzle()}
        <style jsx global>
          {`
            .game-controller-view {
              width: 100%;
              height: 100%;
            }
            .menu {
              width: 320px;
              top: 20%;
              margin-left: auto;
              margin-right: auto;
              left: 0;
              right: 0;
              position: absolute;
              z-index: 111111;
              text-align: center;
            }

            .status {
              position: absolute;
              top: 0;
              right: 0;
              z-index: 100000;
              width: 160px;
              text-align: center;
              word-wrap: break-word;
            }
          `}
        </style>
      </div>
    );
  }

  renderPuzzle() {
    if (this.state.loading) {
      return <Spinner width={100} height={100} />;
    }
    return <PuzzleView onCompleted={this.handleCompleted} blocks={this.state.blocks as Block[]} />;
  }
}
