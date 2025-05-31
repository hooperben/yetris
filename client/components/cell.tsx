import type { CellOptions } from "@/types";

const getCellClasses = (type: CellOptions): string => {
  const baseClasses =
    "w-8 aspect-square border-2 rounded-sm relative overflow-hidden transition-all duration-150";

  switch (type) {
    case "Empty":
      return `${baseClasses} bg-gray-900/50 border-gray-700/50`;
    case "I":
      return `${baseClasses} bg-gradient-to-br from-cyan-300 to-cyan-600 border-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.8)]`;
    case "J":
      return `${baseClasses} bg-gradient-to-br from-blue-300 to-blue-600 border-blue-200 shadow-[0_0_20px_rgba(37,99,235,0.8)]`;
    case "L":
      return `${baseClasses} bg-gradient-to-br from-orange-300 to-orange-600 border-orange-200 shadow-[0_0_20px_rgba(234,88,12,0.8)]`;
    case "O":
      return `${baseClasses} bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.8)]`;
    case "S":
      return `${baseClasses} bg-gradient-to-br from-green-300 to-green-600 border-green-200 shadow-[0_0_20px_rgba(22,163,74,0.8)]`;
    case "T":
      return `${baseClasses} bg-gradient-to-br from-purple-300 to-purple-600 border-purple-200 shadow-[0_0_20px_rgba(124,58,237,0.8)]`;
    case "Z":
      return `${baseClasses} bg-gradient-to-br from-red-300 to-red-600 border-red-200 shadow-[0_0_20px_rgba(220,38,38,0.8)]`;
    default:
      return `${baseClasses} bg-gray-900/50 border-gray-700/50`;
  }
};

const Cell = ({ type }: { type: CellOptions }) => {
  return (
    <div className={getCellClasses(type)}>
      {/* Ultra bright glow effect for filled cells */}
      {type !== "Empty" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
          <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-sm pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default Cell;
