"use client";

import { useState, useEffect, useCallback } from "react";
import { useInterval } from "@/hooks/use-interval";
import TetrisBoard from "./tetris-board";
import { createStage, checkCollision } from "@/lib/tetris-helpers";
import { useGameStatus } from "@/hooks/use-game-status";
import { usePlayer } from "@/hooks/use-player";
import { useStage } from "@/hooks/use-stage";

export default function Tetris() {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared, flashingRows] = useStage(
    player,
    resetPlayer,
  );
  const [score, setScore, rows, setRows, level, setLevel] =
    useGameStatus(rowsCleared);

  const movePlayer = useCallback(
    (dir: number) => {
      if (!checkCollision(player, stage, { x: dir, y: 0 })) {
        updatePlayerPos({ x: dir, y: 0, collided: false });
      }
    },
    [player, stage, updatePlayerPos],
  );

  const startGame = () => {
    // Reset everything in the correct order
    setGameOver(false);
    setPaused(false);
    setGameStarted(false); // Set to false first
    setScore(0);
    setRows(0);
    setLevel(0);
    setStage(createStage());

    // Reset player first, then start the game
    resetPlayer();

    // Small delay to ensure player is reset before starting
    setTimeout(() => {
      setGameStarted(true);
      setDropTime(1000);
    }, 100);
  };

  const togglePause = () => {
    if (gameOver) return;

    if (paused) {
      const newSpeed = Math.max(50, 1000 * Math.pow(0.9, level));
      setDropTime(newSpeed);
    } else {
      setDropTime(null);
    }
    setPaused(!paused);
  };

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      // Increase speed by 10% each level
      const newSpeed = Math.max(50, 1000 * Math.pow(0.9, level + 1));
      setDropTime(newSpeed);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Only mark as collided if the piece is in the visible play area
      if (player.pos.y > 0) {
        updatePlayerPos({ x: 0, y: 0, collided: true });
      } else {
        // Game over - piece can't move down from spawn position
        setGameOver(true);
        setGameStarted(false);
        setDropTime(null);
      }
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (gameOver) return;
    // Remove the down arrow key up logic since we're making it immediately responsive
  };

  const dropPlayer = () => {
    // Don't stop the drop timer, just force an immediate drop
    drop();
    // Restart the drop timer to ensure continuous falling
    const currentSpeed = Math.max(50, 1000 * Math.pow(0.9, level));
    setDropTime(currentSpeed);
  };

  const hardDrop = () => {
    // Create a test player to simulate the drop
    let testPlayer = { ...player, pos: { ...player.pos } };

    // Keep moving down until collision
    while (!checkCollision(testPlayer, stage, { x: 0, y: 1 })) {
      testPlayer.pos.y += 1;
    }

    // Calculate the total distance moved
    const dropDistance = testPlayer.pos.y - player.pos.y;

    // Move to final position and mark as collided
    if (dropDistance > 0) {
      updatePlayerPos({ x: 0, y: dropDistance, collided: true });
    } else {
      // If no movement possible, just mark as collided
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const move = ({ keyCode }: { keyCode: number }) => {
    if (gameOver) return;

    // P key toggles pause regardless of current state
    if (keyCode === 80) {
      // P key - toggle pause if game is started
      if (gameStarted) {
        togglePause();
      }
      return;
    }

    // Other controls only work if game is started and not paused
    if (!gameStarted || paused) return;

    if (keyCode === 37) {
      movePlayer(-1);
    } else if (keyCode === 39) {
      movePlayer(1);
    } else if (keyCode === 40) {
      // Make down arrow immediately responsive but maintain auto-drop
      dropPlayer();
    } else if (keyCode === 38) {
      playerRotate(stage, 1);
    } else if (keyCode === 32) {
      // Space bar for hard drop
      hardDrop();
    }
  };

  useInterval(() => {
    if (gameStarted) {
      drop();
    }
  }, dropTime);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => move(e);
    const handleKeyUp = (e: KeyboardEvent) => keyUp(e);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [player, stage, resetPlayer, rowsCleared, gameStarted, paused]);

  useEffect(() => {
    if (gameStarted && !paused && !gameOver && dropTime === null) {
      // Restart drop timer if it somehow got stopped
      const currentSpeed = Math.max(50, 1000 * Math.pow(0.9, level));
      setDropTime(currentSpeed);
    }
  }, [gameStarted, paused, gameOver, dropTime, level]);

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
      <div className="relative">
        <TetrisBoard stage={stage} flashingRows={flashingRows} />

        {(gameOver || paused) && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center p-6 rounded-lg">
              {gameOver ? (
                <div className="text-red-500 text-3xl font-bold mb-4 animate-pulse">
                  Game Over!
                </div>
              ) : (
                <div className="text-yellow-400 text-3xl font-bold mb-4">
                  Paused
                </div>
              )}
              <button
                onClick={gameOver ? startGame : togglePause}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-all font-bold"
              >
                {gameOver ? "Start Game" : "Resume"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
          <div className="text-xl font-bold text-white mb-2">Next Piece</div>
          <div className="w-24 h-24 grid grid-cols-4 grid-rows-4 gap-0.5 p-2">
            {Array.from({ length: 16 }, (_, index) => {
              const x = index % 4;
              const y = Math.floor(index / 4);
              const cell = player.nextTetromino.shape?.[y]?.[x] || 0;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 ${
                    cell !== 0
                      ? `bg-${player.nextTetromino.color}-500 border border-white/20`
                      : "bg-gray-900"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border-2 border-pink-500 shadow-lg shadow-pink-500/20 w-full">
          <div className="grid grid-cols-2 gap-2 text-white">
            <div className="text-lg font-bold">Score:</div>
            <div className="text-lg text-pink-400">{score}</div>
            <div className="text-lg font-bold">Rows:</div>
            <div className="text-lg text-green-400">{rows}</div>
            <div className="text-lg font-bold">Level:</div>
            <div className="text-lg text-yellow-400">{level}</div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/20 w-full">
          <div className="text-lg font-bold text-white mb-2">Controls</div>
          <div className="grid grid-cols-2 gap-1 text-sm text-white/80">
            <div>←/→</div>
            <div>Move</div>
            <div>↑</div>
            <div>Rotate</div>
            <div>↓</div>
            <div>Soft Drop</div>
            <div>Space</div>
            <div>Hard Drop</div>
            <div>P</div>
            <div>Pause/Resume</div>
          </div>
        </div>

        {!gameStarted || gameOver ? (
          <button
            onClick={startGame}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all font-bold w-full"
          >
            Start Game
          </button>
        ) : !paused ? (
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-md hover:from-yellow-600 hover:to-orange-700 transition-all font-bold w-full"
          >
            Pause Game
          </button>
        ) : (
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all font-bold w-full"
          >
            Resume Game
          </button>
        )}
      </div>
    </div>
  );
}
