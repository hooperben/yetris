import type React from "react"
import Cell from "./cell"

type TetrisBoardProps = {
  stage: (string | number)[][]
  flashingRows?: number[]
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ stage, flashingRows = [] }) => (
  <div
    className="grid gap-0.5 bg-gray-900 p-1 border-4 border-gray-700 rounded-md shadow-xl shadow-purple-500/10"
    style={{
      gridTemplateRows: `repeat(${stage.length}, 1fr)`,
      gridTemplateColumns: `repeat(${stage[0].length}, 1fr)`,
    }}
  >
    {stage.map((row, y) =>
      row.map((cell, x) => (
        <Cell key={`${x}-${y}`} type={cell[0]} color={cell[1]} isFlashing={flashingRows.includes(y)} />
      )),
    )}
  </div>
)

export default TetrisBoard
