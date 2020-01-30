import React from "react";
import { Spinner } from "./Spinner";
import PuzzleView from "./PuzzleView";

import { Block } from "../primitives";

import { randomPuzzle } from "../puzzle";

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
      const blocks = randomPuzzle({ w: 6, h: 6 }).blocks;
      this.setState({ blocks, loading: false, completed: false });
    }, 500);
  }

  handleCompleted() {
    this.setState({ completed: true, loading: false });
  }

  handlePlayAgain() {
    this.setState({ loading: true, completed: false });
    setTimeout(() => {
      const blocks = randomPuzzle({ w: 6, h: 6 }).blocks;
      this.setState({ blocks, loading: false });
    }, 500);
  }

  render() {
    return (
      <div className="game-controller-view">
        <label className="status">
          Api:{process.env.API_BASE_URL}
          Complete:{this.state.completed ? "yes" : "no"}
        </label>
        {this.state.completed && !this.state.loading && (
          <div className="menu">
            <button className="play-again" onClick={this.handlePlayAgain}>
              Play Again
            </button>
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
            .play-again {
              width: 160px;
              height: 1cm;
              background-color: #fff;
              font-weight: bolder;
              color: black;
              border-color: black;
              border-radius: 5px;
              outline: none;
              box-shadow: 0 4px #ccc;
              z-index: 1000000;
            }
            .play-again:active {
              background-color: #cdcdcd;
              box-shadow: 0 2px #888;
              transform: translateY(2px);
            }
            .play-again:hover,
            .play-again:focus {
              background-color: #efefef;
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
