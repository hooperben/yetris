import { Block, SHAPES } from "@/types";

interface Props {
  upcomingBlocks: Block[];
}

// Define colors for each block type
const BLOCK_COLORS: Record<Block, string> = {
  [Block.I]: "#00f0f0", // Cyan
  [Block.O]: "#f0f000", // Yellow
  [Block.T]: "#a000f0", // Purple
  [Block.S]: "#00f000", // Green
  [Block.Z]: "#f00000", // Red
  [Block.J]: "#0000f0", // Blue
  [Block.L]: "#f0a000", // Orange
};

function UpcomingBlocks({ upcomingBlocks }: Props) {
  return (
    <div className="upcoming">
      {upcomingBlocks.map((block, blockIndex) => {
        const shape = SHAPES[block].shape.filter((row) =>
          row.some((cell) => cell),
        );
        const color = BLOCK_COLORS[block];

        return (
          <div key={blockIndex} className="upcoming-block">
            {shape.map((row, rowIndex) => {
              return (
                <div key={rowIndex} className="upcoming-row">
                  {row.map((isSet, cellIndex) => {
                    return (
                      <div
                        key={`${blockIndex}-${rowIndex}-${cellIndex}`}
                        className="upcoming-cell"
                        style={{
                          backgroundColor: isSet ? color : "transparent",
                          border: isSet ? "1px solid #333" : "none",
                          width: "20px",
                          height: "20px",
                          display: "inline-block",
                        }}
                      ></div>
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
