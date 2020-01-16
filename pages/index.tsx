import React from "react";
import PuzzleView from "../src/ui/PuzzleView";
import { randomPuzzle } from "../src/puzzle";
import { Block } from "../src/primitives";

type Props = { blocks: Block[] };
type State = { completed: boolean; blocks: Block[] };

export default class HomePage extends React.Component<Props, State> {
  static getInitialProps = async () => {
    const blocks = randomPuzzle({ w: 6, h: 6 }).blocks;
    return { blocks };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      blocks: props.blocks,
      completed: false
    };
    this.handleCompleted = this.handleCompleted.bind(this);
  }

  componentDidMount() {
    const blocks = randomPuzzle({ w: 6, h: 6 }).blocks;
    this.setState({ blocks });
  }

  handleCompleted() {
    this.setState({ completed: true });
  }
  render() {
    return <PuzzleView onCompleted={this.handleCompleted} blocks={this.state.blocks} />;
  }
}
