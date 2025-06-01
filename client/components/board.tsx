import type { BoardShape } from "@/types";
import Cell from "@/components/cell";

interface BoardProps {
  currentBoard: BoardShape;
  isGameOver?: boolean;
}

const Board = ({ currentBoard, isGameOver }: BoardProps) => {
  return (
    <div className="relative border-4 border-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-xl select-none mx-auto bg-gray-900 shadow-2xl p-4 overflow-hidden z-40">
      {/* Ultra bright border glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-xl blur opacity-75 animate-pulse z-30" />

      {/* Inner container */}
      <div className="relative bg-gray-900 rounded-lg p-2 z-40">
        {/* Game over overlay */}
        {isGameOver && (
          <>
            <div className="absolute inset-0 bg-black/80 z-50 rounded-lg" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text z-60 drop-shadow-lg animate-pulse">
              GAME OVER
            </div>
          </>
        )}

        {/* Board grid */}
        <div className="relative z-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-1">
          {currentBoard.map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
