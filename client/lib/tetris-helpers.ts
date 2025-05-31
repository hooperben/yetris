export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, "clear"]));

export const checkCollision = (
  player: any,
  stage: any[][],
  { x: moveX, y: moveY }: { x: number; y: number },
) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (player.tetromino[y][x] !== 0) {
        const newY = y + player.pos.y + moveY;
        const newX = x + player.pos.x + moveX;

        if (
          // 2. Check that our move is inside the game areas height (y)
          // We shouldn't go through the bottom of the play area
          newY >= STAGE_HEIGHT ||
          // 3. Check that our move is inside the game areas width (x)
          // Check left boundary
          newX < 0 ||
          // Check right boundary
          newX >= STAGE_WIDTH ||
          // 4. Check that we're not below the stage
          newY < 0 ||
          // 5. Check that the cell we're moving to isn't set to clear (if it exists)
          (stage[newY] && stage[newY][newX] && stage[newY][newX][1] !== "clear")
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
