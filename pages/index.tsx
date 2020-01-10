import React from "react";
import PuzzleView from "../src/components/PuzzleView";
import { randomPuzzle } from "../src/puzzle";
import { Block } from "../src/primitives";

export default function HomePage(props: { blocks: Block[] }) {
  return <PuzzleView blocks={props.blocks} />;
}

HomePage.getInitialProps = async () => {
  const blocks = randomPuzzle({ w: 6, h: 6 }).blocks;
  return { blocks };
};
