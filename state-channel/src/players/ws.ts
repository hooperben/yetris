import { WebSocketServer, WebSocket } from "ws";
import { randomBytes } from "crypto";
import { Server } from "http";

export interface TetrisWebSocket extends WebSocket {
  playerId: string;
  roomId: string;
  channelId?: string;
}

// Import Block enum - you'll need to copy this from your client types
enum Block {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

// Game state storage
interface GameState {
  gameId: string;
  playerId: string;
  upcomingBlocks: Block[];
  isActive: boolean;
}

const games = new Map<string, GameState>();

function getRandomBlock(): Block {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)] as Block;
}

async function handleWebSocketMessage(
  ws: TetrisWebSocket,
  data: any,
): Promise<void> {
  switch (data.type) {
    case "startGame": {
      console.log("start game web socket called");

      // Generate a new game ID
      const gameId = randomBytes(8).toString("hex");

      // Create initial upcoming blocks (just 2 to start - current and next)
      const initialBlocks = [getRandomBlock(), getRandomBlock()];

      // Store the game
      games.set(gameId, {
        gameId,
        playerId: ws.playerId,
        upcomingBlocks: initialBlocks,
        isActive: true,
      });

      // Send response back to client
      ws.send(
        JSON.stringify({
          type: "gameStarted",
          gameId,
          upcomingBlocks: initialBlocks,
        }),
      );

      break;
    }

    case "moveComplete": {
      console.log("next block requested");

      const { gameId } = data;
      if (!gameId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "gameId is required",
          }),
        );
        return;
      }

      const game = games.get(gameId);
      if (!game) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Game not found",
          }),
        );
        return;
      }

      if (game.playerId !== ws.playerId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unauthorized - not your game",
          }),
        );
        return;
      }

      if (!game.isActive) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Game is not active",
          }),
        );
        return;
      }

      // Add one new random block to the end
      game.upcomingBlocks.shift();
      game.upcomingBlocks.push(getRandomBlock());

      console.log("current blocks: ", game.upcomingBlocks);

      // Update stored game state
      games.set(gameId, game);

      // Send response back to client
      ws.send(
        JSON.stringify({
          type: "moveCompleted",
          gameId,
          upcomingBlocks: game.upcomingBlocks,
        }),
      );

      break;
    }

    case "gameOver": {
      console.log("game over");

      const { gameId } = data;
      if (!gameId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "gameId is required",
          }),
        );
        return;
      }

      const game = games.get(gameId);
      if (!game) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Game not found",
          }),
        );
        return;
      }

      if (game.playerId !== ws.playerId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unauthorized - not your game",
          }),
        );
        return;
      }

      // End the game
      game.isActive = false;
      games.set(gameId, game);

      // Send confirmation back to client
      ws.send(
        JSON.stringify({
          type: "gameEnded",
          gameId,
        }),
      );

      break;
    }
  }
}

export const runPlayerWS = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    const tetrisWs = ws as TetrisWebSocket;
    tetrisWs.playerId = randomBytes(8).toString("hex");

    tetrisWs.on("message", async (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        await handleWebSocketMessage(tetrisWs, data);
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    tetrisWs.on("close", async () => {
      // Clean up any active games for this player
      for (const [gameId, game] of games.entries()) {
        if (game.playerId === tetrisWs.playerId) {
          games.delete(gameId);
          console.log(`Cleaned up game ${gameId} for disconnected player`);
        }
      }
      console.log("player connection closed");
    });
  });
};
