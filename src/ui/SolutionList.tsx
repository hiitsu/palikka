import React, { Fragment, useState, useEffect } from "react";
import Api from "./Api";
import { Puzzle } from "src/primitives";

export default (props: { signedUp: boolean }) => {
  const [solutions, setSolutions] = useState<Puzzle[]>([]);

  useEffect(() => {
    if (!props.signedUp) Api.solution.list().then((res: any) => setSolutions(res.data.solutions));
  });

  console.log("solutions", solutions);
  return (
    <div>
      {(solutions || []).map(solution => {
        return <p>{solution}</p>;
      })}
    </div>
  );
};
