import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { AuthProvider, AuthConsumer } from "../src/ui/AuthContext";
import ScoreList from "../src/ui/ScoreList";

export default (props: any) => {
  return (
    <AuthProvider>
      <Head>
        <title>My Puzzles</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <h1>Completed Puzzles</h1>
      <AuthConsumer>{({ signedUp }) => <ScoreList signedUp={signedUp} />}</AuthConsumer>
    </AuthProvider>
  );
};
