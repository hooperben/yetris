import { BoardShape } from "@/types";
import Cell from "@/components/cell";

interface BoardProps {
  currentBoard: BoardShape;
}

const Board = ({ currentBoard }: BoardProps) => {
  // BOARD
  return (
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
