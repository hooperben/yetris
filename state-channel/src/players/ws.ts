import { WebSocketServer, WebSocket } from "ws";
import { randomBytes } from "crypto";
import { Server } from "http";
import { ethers } from "ethers";
import { createPublicClient, createWalletClient, http } from "viem";
import { polygon } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

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
  address: string;
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

      // Extract signature data
      const { address, message, signature } = data;

      if (!address || !message || !signature) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "address, message, and signature are required",
          }),
        );
        return;
      }

      try {
        // Verify the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Invalid signature - signature does not match address",
            }),
          );
          return;
        }

        console.log(`Signature verified for address: ${address}`);
      } catch (error) {
        console.error("Signature verification failed:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Signature verification failed",
          }),
        );
        return;
      }

      // Generate a new game ID
      const gameId = randomBytes(8).toString("hex");

      // Create initial upcoming blocks (just 2 to start - current and next)
      const initialBlocks = [getRandomBlock(), getRandomBlock()];

      // Store the game with verified address
      games.set(gameId, {
        gameId,
        playerId: ws.playerId,
        address: address.toLowerCase(),
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

      const { gameId, score } = data;

      if (!gameId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "gameId is required",
          }),
        );
        return;
      }

      if (!score || typeof score !== "number") {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "score is required and must be a number",
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

      let coronationHash: string | undefined;

      try {
        // Check if score beats current high score and call coronation if it does
        const publicClient = createPublicClient({
          chain: polygon,
          transport: http(),
        });

        const account = privateKeyToAccount(
          process.env.PRIVATE_KEY as `0x${string}`,
        );
        const walletClient = createWalletClient({
          account,
          chain: polygon,
          transport: http(),
        });

        const trophyAddress = "0x6d64b04A8ec0dceb6304CC56845C665Fd454a0F1";

        // Read current high score
        const currentHighScore = await publicClient.readContract({
          address: trophyAddress,
          abi: [
            {
              inputs: [],
              name: "highScore",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "highScore",
        });

        console.log("Current high score:", currentHighScore.toString());
        console.log("Player score:", score);

        // If player's score is higher, call coronation
        if (BigInt(score) > currentHighScore) {
          console.log("New high score! Calling coronation...");

          coronationHash = await walletClient.writeContract({
            address: trophyAddress,
            abi: [
              {
                inputs: [
                  { internalType: "address", name: "to", type: "address" },
                  { internalType: "uint256", name: "newHigh", type: "uint256" },
                ],
                name: "coronation",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ],
            functionName: "coronation",
            args: [game.address as `0x${string}`, BigInt(score)],
          });

          console.log("Coronation transaction hash:", coronationHash);
        }
      } catch (error) {
        console.error("Error checking/updating high score:", error);
        // Continue with game over response even if coronation fails
      }

      // Send confirmation back to client
      ws.send(
        JSON.stringify({
          type: "gameEnded",
          gameId,
          ...(coronationHash && { coronationHash }),
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
