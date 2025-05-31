import { BoardShape } from "@/types";
import Cell from "@/components/cell";

interface BoardProps {
  currentBoard: BoardShape;
  isGameOver?: boolean;
}

const Board = ({ currentBoard, isGameOver }: BoardProps) => {
  return (
    <div className="relative border-2 border-border rounded-xl select-none mx-auto bg-background shadow-lg p-4 overflow-hidden">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.03] pointer-events-none rounded-lg" />

      {/* Grid overlay */}
      <div className="absolute inset-4 z-5 pointer-events-none">
        {currentBoard.map((row, rowIndex) => (
          <div className="flex" key={`grid-${rowIndex}`}>
            {row.map((_, colIndex) => (
              <div
                key={`grid-${rowIndex}-${colIndex}`}
                className="border border-border/30 aspect-square flex-1"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Game over overlay */}
      {isGameOver && (
        <>
          <div className="absolute inset-0 bg-black/70 z-10" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white z-20 drop-shadow-lg">
            Game Over
          </div>
        </>
      )}

      {/* Board grid */}
      <div className="relative z-0">
        {currentBoard.map((row, rowIndex) => (
          <div className="flex" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
