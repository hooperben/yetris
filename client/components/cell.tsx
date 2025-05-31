import { CellOptions } from "@/types";

const getCellClasses = (type: CellOptions): string => {
  const baseClasses =
    "w-8 aspect-square border-2 rounded-sm relative overflow-hidden";

  switch (type) {
    case "Empty":
      return `${baseClasses} bg-white/5 border-white/8`;
    case "I":
      return `${baseClasses} tetris-cell-cyan border-cyan-400`;
    case "J":
      return `${baseClasses} tetris-cell-blue border-blue-500`;
    case "L":
      return `${baseClasses} tetris-cell-orange border-orange-500`;
    case "O":
      return `${baseClasses} tetris-cell-yellow border-yellow-400`;
    case "S":
      return `${baseClasses} tetris-cell-green border-green-500`;
    case "T":
      return `${baseClasses} tetris-cell-purple border-violet-500`;
    case "Z":
      return `${baseClasses} tetris-cell-red border-red-500`;
    default:
      return `${baseClasses} bg-white/5 border-white/10`;
  }
};

const Cell = ({ type }: { type: CellOptions }) => {
  return (
    <div className={getCellClasses(type)}>
      {/* Glass effect for filled cells */}
      {type !== "Empty" && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 pointer-events-none" />
      )}
    </div>
  );
};

export default Cell;
