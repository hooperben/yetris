"use client";

import Board from "@/components/board";
import ConnectWallet from "@/components/connect-wallet";
import { GameOverDialog } from "@/components/game-over-dialog";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import UpcomingBlocks from "@/components/upcoming-blocks";
import { useTetris } from "@/hooks/use-tetris";
import {
  ArrowDownFromLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RefreshCcw,
} from "lucide-react";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  const {
    board,
    startGame,
    isPlaying,
    score,
    nextBlock,
    isWsConnected,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    isGameOver,
    setIsGameOver,
  } = useTetris();

  const handlePlayAgain = () => {
    setIsGameOver(false);
    startGame();
  };

  const handleCloseDialog = () => {
    setIsGameOver(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navigation />
        <div className="flex flex-col w-full items-center">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-start gap-8">
            <div className="flex flex-col items-center">
              <Board currentBoard={board} />
            </div>
            {/* Side Panel */}
            <div className="flex flex-col gap-4">
              {/* Score */}
              <div className="text-center bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border-2 border-yellow-400/50 shadow-xl">
                <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                  SCORE
                </h2>
                <div className="text-4xl font-bold text-white">
                  {score.toLocaleString()}
                </div>
              </div>

              {/* Next Block */}
              {isPlaying && nextBlock && (
                <UpcomingBlocks upcomingBlocks={[nextBlock]} />
              )}

              {/* Game Controls */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border-2 border-purple-400/50 shadow-xl">
                {!isPlaying ? (
                  <Button
                    onClick={startGame}
                    disabled={!isWsConnected}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.6)] border-2 border-purple-300 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    NEW GAME
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      CONTROLS
                    </h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>← → Move</div>
                      <div>↑ Rotate</div>
                      <div>↓ Soft Drop</div>
                      <div>Space Hard Drop</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Connection Status */}
              {!isWsConnected && (
                <div className="bg-gradient-to-br from-yellow-800/80 to-orange-800/80 rounded-xl p-4 border-2 border-yellow-400/50">
                  <p className="text-yellow-300 font-semibold">
                    Connecting to server...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[100px] md:hidden">
        <div className="flex flex-row justify-center gap-4 p-2 max-h-[100px] items-center">
          {/* Score */}
          <div className="flex flex-row bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-3 border border-yellow-400/50 items-center">
            <div className="text-md text-yellow-300 mr-2">SCORE: </div>
            <div className="text-md font-bold text-white">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Next Block */}
          {isPlaying && nextBlock ? (
            <div className="flex justify-center">
              <div className="scale-75 origin-center">
                <UpcomingBlocks upcomingBlocks={[nextBlock]} />
              </div>
            </div>
          ) : !isPlaying ? (
            <div className="rounded-lg">
              <Button
                onClick={startGame}
                disabled={!isWsConnected}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white px-2 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(34,197,94,0.6)] border border-green-300 disabled:opacity-50"
              >
                NEW GAME
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <GameOverDialog
        isOpen={isGameOver}
        onClose={handleCloseDialog}
        onPlayAgain={handlePlayAgain}
        score={score}
      />

      <div className="md:hidden flex flex-col">
        {/* Game Area - 80% of non-nav height */}
        <div
          className="flex bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
          style={{ height: "60vh" }}
        >
          {/* Game Board - Left side */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="scale-75 origin-center">
              <Board currentBoard={board} />
            </div>
          </div>
        </div>

        {/* Mobile Controls - 20% of non-nav height */}
        <div className="border-t-1 border-purple-400">
          {isPlaying && (
            <div className="flex flex-row justify-center w-full">
              <div className="h-full flex flex-col justify-center p-2">
                <div className="flex justify-center">
                  <Button
                    size="icon"
                    className="size-12 border"
                    onClick={(e) => {
                      e.preventDefault();
                      rotate?.();
                    }}
                  >
                    <ChevronUp />
                  </Button>
                </div>

                <div className="flex flex-row justify-center gap-12 my-2">
                  <Button
                    size="icon"
                    className="size-12 border"
                    onClick={(e) => {
                      e.preventDefault();
                      moveLeft?.();
                    }}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    size="icon"
                    className="size-12 border"
                    onClick={(e) => {
                      e.preventDefault();
                      moveRight?.();
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button
                    size="icon"
                    className="size-12 border"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      softDrop?.();
                    }}
                  >
                    <ChevronDown />
                  </Button>
                </div>
              </div>
              <div className="w-24" />
              <div className="flex items-center">
                <div className="flex justify-center gap-4">
                  <Button
                    size="icon"
                    className="size-12 border"
                    onClick={(e) => {
                      e.preventDefault();
                      hardDrop?.();
                    }}
                  >
                    <ArrowDownFromLine />
                  </Button>
                  <Button
                    size="icon"
                    className="size-12 border"
                    onClick={(e) => {
                      e.preventDefault();
                      rotate?.();
                    }}
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        {!isWsConnected && (
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-600/90 text-center py-1">
            <p className="text-yellow-100 font-semibold text-xs">
              Connecting to server...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
