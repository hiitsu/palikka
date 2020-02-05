import React, { useState, useEffect } from "react";
import Api from "./Api";
import { Puzzle } from "src/primitives";

export default (props: { signedUp: boolean }) => {
  const [solutions, setSolutions] = useState<Puzzle[] | null>(null);

  useEffect(() => {
    if (!props.signedUp) return;
    if (solutions) return;
    (async function callApi() {
      const list = await Api.solution.list();
      console.log("list", list);
      setSolutions(list);
    })();
  });
  if (!solutions || !solutions.length) {
    return <p>You haven't played anything yet</p>;
  }
  return (
    <>
      {solutions.map((solution, index) => {
        return <p key={index}>{JSON.stringify(solution)}</p>;
      })}
    </>
  );
};
