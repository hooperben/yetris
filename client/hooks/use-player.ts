"use client";

import { useState, useCallback } from "react";
import { TETROMINOS, randomTetromino } from "@/lib/tetrominos";
import { STAGE_WIDTH, checkCollision } from "@/lib/tetris-helpers";

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape, // Start with empty piece
    collided: false,
    nextTetromino: randomTetromino(), // Initialize with a random piece
  });

  const rotate = (matrix: any[], dir: number) => {
    // Make the rows become columns (transpose)
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index]),
    );
    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  };

  const playerRotate = (stage: any[][], dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const originalX = clonedPlayer.pos.x;

    // Try to keep the piece in the same x position
    if (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      setPlayer(clonedPlayer);
      return;
    }

    // If there's a collision, try small adjustments
    for (let offset = 1; offset <= 2; offset++) {
      // Try moving right
      clonedPlayer.pos.x = originalX + offset;
      if (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
        setPlayer(clonedPlayer);
        return;
      }

      // Try moving left
      clonedPlayer.pos.x = originalX - offset;
      if (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
        setPlayer(clonedPlayer);
        return;
      }
    }

    // If no position works, don't rotate
    clonedPlayer.pos.x = originalX;
  };

  const updatePlayerPos = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    // Use the next tetromino that was already generated
    const currentNextPiece = player.nextTetromino;

    // Generate a new next piece
    const newNextPiece = randomTetromino();

    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: -1 },
      tetromino: currentNextPiece.shape,
      collided: false,
      nextTetromino: newNextPiece,
    });
  }, [player.nextTetromino]);

  return [player, updatePlayerPos, resetPlayer, playerRotate] as const;
};
