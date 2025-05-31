"use client";

import Board from "@/components/board";
import UpcomingBlocks from "@/components/upcoming-blocks";
import { useTetris } from "@/hooks/use-tetris";

export default function Home() {
  const {
    board,
    startGame,
    isPlaying,
    score,
    nextBlock,
    isWsConnected,
    isLoadingBlocks,
  } = useTetris();

  return (
    <div className="app">
      <h1>Tetris</h1>
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        {!isWsConnected && <p>Connecting to server...</p>}
        {isPlaying ? (
          <div>
            {isLoadingBlocks ? (
              <p>Loading next block...</p>
            ) : nextBlock ? (
              <UpcomingBlocks upcomingBlocks={[nextBlock]} />
            ) : (
              <p>No upcoming blocks</p>
            )}
          </div>
        ) : (
          <>
            <button onClick={startGame} disabled={!isWsConnected}>
              New Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}
