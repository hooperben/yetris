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
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
  } = useTetris();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="text-foreground">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-center text-white mb-2">
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
                    className="px-6 text-base font-semibold bg-primary text-primary-foreground border-none rounded-md cursor-pointer shadow-md hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    New Game
                  </button>
                )}

                <div className="w-48 flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-white mb-2">
                    Score: {score}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 bg-gray-800 flex-shrink-0">
          <h1 className="text-xl font-bold">Yetris</h1>
          {!isPlaying ? (
            <button
              onClick={startGame}
              disabled={!isWsConnected}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              New Game
            </button>
          ) : (
            <div className="flex items-center">
              {isLoadingBlocks ? (
                <p className="text-xs">Loading...</p>
              ) : nextBlock ? (
                <div className="bg-gray-700 rounded scale-75">
                  <UpcomingBlocks upcomingBlocks={[nextBlock]} />
                </div>
              ) : (
                <p className="text-xs">No next block</p>
              )}
            </div>
          )}
        </div>

        {/* Score and Next Block Row */}
        {/* <div className="flex justify-between items-center p-3 bg-gray-800 border-t border-gray-700 flex-shrink-0">
          <div className="text-base font-semibold">Score: {score}</div>
          {isPlaying && (
            
          )}
        </div> */}

        {/* Game Board - Fixed height to prevent overflow */}
        <div
          className="flex items-center justify-center p-2 flex-shrink-0"
          style={{ height: "calc(100vh - 280px)" }}
        >
          <div className="max-h-full max-w-xs w-full flex items-center justify-center">
            <div className="scale-75 origin-center">
              <Board currentBoard={board} />
            </div>
          </div>
        </div>

        {/* Mobile Controls - Always visible at bottom */}
        {!isPlaying && (
          <div className="p-3 bg-gray-800 flex-shrink-0">
            {/* Top row - Rotate and Hard Drop */}
            <div className="flex justify-center gap-3 mb-3">
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  rotate?.();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold active:bg-blue-700 touch-manipulation text-sm"
              >
                ↻ ROTATE
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  hardDrop?.();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold active:bg-red-700 touch-manipulation text-sm"
              >
                ⬇
              </button>
            </div>

            {/* Bottom row - Movement controls */}
            <div className="flex justify-center gap-2">
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveLeft?.();
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold active:bg-gray-700 touch-manipulation flex-1 max-w-20 text-lg"
              >
                ←
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  softDrop?.();
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold active:bg-gray-700 touch-manipulation flex-1 max-w-20 text-lg"
              >
                ⬇
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveRight?.();
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold active:bg-gray-700 touch-manipulation flex-1 max-w-20 text-lg"
              >
                →
              </button>
            </div>

            {/* Connection status */}
            {!isWsConnected && (
              <p className="text-center text-yellow-400 mt-2 text-xs">
                Connecting to server...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
