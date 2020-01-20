import React from "react";

import { Spinner } from "./Spinner";
import PuzzleView from "./PuzzleView";

import { Block } from "../primitives";

import { randomPuzzle } from "../puzzle";

type Props = {};
type State = { completed: boolean; blocks: Block[] | null };

export default class GameControllerView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      blocks: null,
      completed: false
    };

    this.handleCompleted = this.handleCompleted.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const blocks = randomPuzzle({ w: 6, h: 6 }).blocks;
      this.setState({ blocks });
    }, 500);
  }

  handleCompleted() {
    this.setState({ completed: true });
  }

  render() {
    return (
      <div className="game-controller-view">
        <label className="status">
          Api:{process.env.API_BASE_URL}
          Complete:{this.state.completed ? "yes" : "no"}
        </label>
        {this.renderPuzzle()}
        <style jsx global>
          {`
            .game-controller-view {
              width: 100%;
              height: 100%;
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
    if (!this.state.blocks) {
      return <Spinner width={100} height={100} />;
    }
    return <PuzzleView onCompleted={this.handleCompleted} blocks={this.state.blocks} />;
  }
}
