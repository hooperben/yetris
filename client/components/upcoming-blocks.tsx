import { Block, SHAPES } from "@/types";

interface Props {
  upcomingBlocks: Block[];
}

// Define Tailwind colors for each block type
const BLOCK_COLORS: Record<Block, string> = {
  [Block.I]: "bg-cyan-500",
  [Block.O]: "bg-yellow-500",
  [Block.T]: "bg-violet-600",
  [Block.S]: "bg-green-600",
  [Block.Z]: "bg-red-600",
  [Block.J]: "bg-blue-600",
  [Block.L]: "bg-orange-600",
};

function UpcomingBlocks({ upcomingBlocks }: Props) {
  return (
    <div className="w-40 flex flex-col gap-6 mt-6 p-4 bg-white/5 rounded-lg shadow-md">
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
                        className={`w-5 h-5 inline-block ${
                          isSet
                            ? `${colorClass} border border-gray-600`
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
