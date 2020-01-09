import React from "react";
import PuzzleView from "../src/components/PuzzleView";
import { blocks } from "../src/puzzle";

export default (props: any) => {
  return <PuzzleView blocks={blocks.slice(5, 10)} />;
};
