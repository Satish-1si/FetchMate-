

// app/match/page.js
import React from "react";
import MatchResultClient from "../components/MatchResultClient";

// Fetching search params on the server side and passing to client component
const MatchResultServer = ({ searchParams }) => {
  const matchId = searchParams?.matchId;

  if (!matchId) {
    return <div>No match found</div>;
  }

  return <MatchResultClient matchId={matchId} />;
};

export default MatchResultServer;
