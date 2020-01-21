import React, { Fragment } from "react";
import GameControllerView from "../src/ui/GameControllerView";
import Head from "next/head";
import { AuthProvider } from "../src/ui/AuthContext";

export default (props: any) => {
  return (
    <AuthProvider>
      <Head>
        <title>index</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width, user-scalable=no"
          key="viewport"
        />
      </Head>
      <GameControllerView />
    </AuthProvider>
  );
};
