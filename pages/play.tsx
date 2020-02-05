import React, { Fragment } from "react";
import GameControllerView from "../src/ui/GameControllerView";
import CommonHead from "../src/ui/CommonHead";
import { AuthProvider } from "../src/ui/AuthContext";

export default (props: any) => {
  return (
    <AuthProvider>
      <CommonHead title="Palikka - Solve puzzles like a pro" />
      <GameControllerView />
    </AuthProvider>
  );
};
