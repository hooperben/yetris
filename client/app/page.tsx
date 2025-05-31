"use client";

import Board from "@/components/board";
import UpcomingBlocks from "@/components/upcoming-blocks";
import HighScores from "@/components/high-scores";
import { useTetris } from "@/hooks/use-tetris";

export default function Home() {
  const { board, startGame, isPlaying, score, upcomingBlocks } = useTetris();

  return (
    <div className="app">
      <h1>Tetris</h1>
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
        ) : (
          <>
            <button onClick={startGame}>New Game</button>
            <HighScores />
          </>
        )}
      </div>
    </div>
  );
}
