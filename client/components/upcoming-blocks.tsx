import { Block, SHAPES } from "@/types";

interface Props {
  upcomingBlocks: Block[];
}

// Ultra bright colors for each block type
const BLOCK_COLORS: Record<Block, string> = {
  [Block.I]:
    "bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]",
  [Block.O]:
    "bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]",
  [Block.T]:
    "bg-gradient-to-br from-purple-300 to-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.8)]",
  [Block.S]:
    "bg-gradient-to-br from-green-300 to-green-500 shadow-[0_0_15px_rgba(22,163,74,0.8)]",
  [Block.Z]:
    "bg-gradient-to-br from-red-300 to-red-500 shadow-[0_0_15px_rgba(220,38,38,0.8)]",
  [Block.J]:
    "bg-gradient-to-br from-blue-300 to-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)]",
  [Block.L]:
    "bg-gradient-to-br from-orange-300 to-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.8)]",
};

function UpcomingBlocks({ upcomingBlocks }: Props) {
  return (
    <div className="w-40 flex flex-col gap-6 p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg shadow-xl border-2 border-purple-400/50">
      {upcomingBlocks.map((block, blockIndex) => {
        const shape = SHAPES[block].shape.filter((row) =>
          row.some((cell) => cell),
        );
        const colorClass = BLOCK_COLORS[block];

        return (
          <div key={blockIndex} className="flex flex-col items-center">
            {shape.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="flex justify-center">
                  {row.map((isSet, cellIndex) => {
                    return (
                      <div
                        key={`${blockIndex}-${rowIndex}-${cellIndex}`}
                        className={`w-5 h-5 inline-block rounded-sm ${
                          isSet
                            ? `${colorClass} border border-white/30`
                            : "transparent"
                        }`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default UpcomingBlocks;
