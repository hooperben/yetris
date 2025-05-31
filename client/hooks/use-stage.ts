"use client"

import { useState, useEffect } from "react"
import { createStage } from "@/lib/tetris-helpers"
import { TETROMINOS } from "@/lib/tetrominos"

export const useStage = (player: any, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage())
  const [rowsCleared, setRowsCleared] = useState(0)
  const [flashingRows, setFlashingRows] = useState<number[]>([])

  useEffect(() => {
    setRowsCleared(0)

    const sweepRows = (newStage: any[][]) => {
      const rowsToRemove: number[] = []

      // Find rows that are full
      newStage.forEach((row, index) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          rowsToRemove.push(index)
        }
      })

      if (rowsToRemove.length > 0) {
        // Set flashing rows
        setFlashingRows(rowsToRemove)

        // After flashing animation, remove the rows
        setTimeout(() => {
          setStage((prevStage) => {
            const newStage = [...prevStage]
            // Remove full rows and add empty rows at top
            rowsToRemove.reverse().forEach((rowIndex) => {
              newStage.splice(rowIndex, 1)
              newStage.unshift(new Array(prevStage[0].length).fill([0, "clear"]))
            })
            return newStage
          })
          setFlashingRows([])
          setRowsCleared(rowsToRemove.length)
        }, 500) // Flash for 500ms

        return newStage // Return original stage during flashing
      }

      return newStage
    }

    const updateStage = (prevStage: any[][]) => {
      // First flush the stage
      const newStage = prevStage.map((row) => row.map((cell) => (cell[1] === "clear" ? [0, "clear"] : cell)))

      // Then draw the tetromino
      player.tetromino.forEach((row: any[], y: number) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const newY = y + player.pos.y
            const newX = x + player.pos.x

            // Only draw if the piece is within the visible game area
            // AND either not collided or below the spawn area (y > 0)
            if (newY >= 0 && newY < newStage.length && newX >= 0 && newX < newStage[0].length) {
              // Get the color from the tetromino type
              const tetrominoType = value as keyof typeof TETROMINOS
              const color = player.collided && newY > 0 ? TETROMINOS[tetrominoType]?.color || "clear" : "clear"
              newStage[newY][newX] = [value, color]
            }
          }
        })
      })

      // Then check if we collided
      if (player.collided && player.pos.y > 0) {
        resetPlayer()
        return sweepRows(newStage)
      }

      return newStage
    }

    // Only update if not currently flashing
    if (flashingRows.length === 0) {
      setStage((prev) => updateStage(prev))
    }
  }, [player, resetPlayer, flashingRows])

  return [stage, setStage, rowsCleared, flashingRows] as const
}
