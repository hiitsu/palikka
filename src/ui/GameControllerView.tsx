import React from "react";
import { Spinner } from "./Spinner";
import PuzzleView from "./PuzzleView";
import { Block, PositionedBlock, Puzzle } from "../primitives";
import Button from "./Button";
import Api from "./Api";
import { millisToMinutesAndSeconds } from "../util";

type Props = {};
type State = {
  completed: boolean;
  blocks: Block[] | null;
  loading: boolean;
  puzzle?: Puzzle;
  started?: number | null;
  intervalId?: NodeJS.Timeout;
  seconds?: number;
};

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
    this.handleUpdateTime = this.handleUpdateTime.bind(this);
  }

  async componentDidMount() {
    const puzzle = await Api.puzzle.newPuzzle();
    const blocks = puzzle.positionedBlocks.map(positionedBlock => positionedBlock.block);
    const intervalId = setInterval(this.handleUpdateTime, 500);
    this.setState({ blocks, loading: false, completed: false, puzzle, intervalId, seconds: 0, started: Date.now() });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId as NodeJS.Timeout);
  }

  async handleCompleted(positionedBlocks: PositionedBlock[]) {
    const puzzle = this.state.puzzle as Puzzle;
    const seconds = this.state.seconds as number;
    const solution = { ...puzzle, positionedBlocks, seconds, solutionFor: puzzle.id };
    delete solution.id;
    await Api.solution.save(solution);
    this.setState({ completed: true, loading: false, started: null });
  }

  async handlePlayAgain() {
    this.setState({ loading: true, completed: false });
    const puzzle = await Api.puzzle.newPuzzle();
    const blocks = puzzle.positionedBlocks.map(positionedBlock => positionedBlock.block);
    this.setState({ blocks, loading: false, completed: false, puzzle, started: Date.now() });
  }

  handleUpdateTime() {
    if (!this.state.started) return;
    const seconds = (Date.now() - (this.state.started as number)) / 1000;
    this.setState({ seconds });
  }

  render() {
    return (
      <div className="game-controller-view">
        {this.state.completed && !this.state.loading && (
          <div className="menu">
            <Button text={"Play Again"} onClick={this.handlePlayAgain} />
          </div>
        )}
        {<div className="seconds">{millisToMinutesAndSeconds((this.state.seconds || 0) * 1000)}</div>}
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
            .seconds {
              font-family: Inconsolata;
              font-size: 2em;
              user-select: none;
              touch-action: none;
              position: absolute;
              right: 0.2em;
              top: 0.2em;
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
