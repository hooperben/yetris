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
    <div className="text-foreground p-5">
      <div className="flex flex-col">
        <h1
          className="text-4xl font-bold text-center text-white mb-4"
          style={{ gridArea: "title" }}
        >
          Yetris
        </h1>

        <div className="flex flex-row">
          <Board currentBoard={board} />

          <div className="flex flex-col">
            {!isWsConnected && (
              <p className="text-white">Connecting to server...</p>
            )}
            {isPlaying ? (
              <div>
                {isLoadingBlocks ? (
                  <p className="text-white">Loading next block...</p>
                ) : nextBlock ? (
                  <UpcomingBlocks upcomingBlocks={[nextBlock]} />
                ) : (
                  <p className="text-white">No upcoming blocks</p>
                )}
              </div>
            ) : (
              <button
                onClick={startGame}
                disabled={!isWsConnected}
                className="px-6 py-3 text-base font-semibold bg-primary text-primary-foreground border-none rounded-md cursor-pointer shadow-md hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                New Game
              </button>
            )}

            <div
              style={{ gridArea: "controls" }}
              className="w-48 flex flex-col gap-4"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Score: {score}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
