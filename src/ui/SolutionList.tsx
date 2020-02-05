import React, { Fragment, useState, useEffect } from "react";
import Api from "./Api";
import { Puzzle } from "src/primitives";

export default (props: { signedUp: boolean }) => {
  const [solutions, setSolutions] = useState<Puzzle[]>([]);

  useEffect(() => {
    if (!props.signedUp) return;
    (async function anyNameFunction() {
      const list = await Api.solution.list();
      setSolutions(list);
    })();
  });

  console.log("solutions", solutions);
  return (
    <div>
      {(solutions || []).map((solution, index) => {
        return <p key={index}>{JSON.stringify(solution)}</p>;
      })}
    </div>
  );
};
