"use client";

import { useState, useEffect, useRef } from "react";

interface GameState {
  gameId: string | null;
  currentState: number[] | null;
  isActive: boolean;
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    currentState: null,
    isActive: false,
  });
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket("ws://localhost:8000");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      addMessage("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        addMessage(`Received: ${JSON.stringify(data, null, 2)}`);

        // Handle different message types
        switch (data.type) {
          case "gameStarted":
            setGameState({
              gameId: data.gameId,
              currentState: data.gameState,
              isActive: true,
            });
            break;
          case "moveCompleted":
            setGameState((prev) => ({
              ...prev,
              currentState: data.gameState,
            }));
            break;
          case "gameEnded":
            setGameState((prev) => ({
              ...prev,
              isActive: false,
            }));
            break;
          case "error":
            console.error("WebSocket error:", data.message);
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      addMessage("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      addMessage("WebSocket error occurred");
    };

    return () => {
      ws.close();
    };
  }, []);

  const addMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const sendMessage = (message: object) => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify(message));
      addMessage(`Sent: ${JSON.stringify(message, null, 2)}`);
    } else {
      addMessage("Not connected to WebSocket");
    }
  };

  const handleStartGame = () => {
    sendMessage({ type: "startGame" });
  };

  const handleMoveComplete = () => {
    if (!gameState.gameId) {
      addMessage("No active game - start a game first");
      return;
    }
    sendMessage({
      type: "moveComplete",
      gameId: gameState.gameId,
    });
  };

  const handleGameOver = () => {
    if (!gameState.gameId) {
      addMessage("No active game - start a game first");
      return;
    }
    sendMessage({
      type: "gameOver",
      gameId: gameState.gameId,
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Yetris - WebSocket Test</h1>

      {/* Connection Status */}
      <div className="mb-6">
        <div
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            connected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>

      {/* Game State Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Game State</h2>
        <div className="space-y-2">
          <div>
            <strong>Game ID:</strong> {gameState.gameId || "None"}
          </div>
          <div>
            <strong>State:</strong>{" "}
            {gameState.currentState
              ? JSON.stringify(gameState.currentState)
              : "None"}
          </div>
          <div>
            <strong>Active:</strong> {gameState.isActive ? "Yes" : "No"}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={handleStartGame}
          disabled={!connected}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Start Game
        </button>

        <button
          onClick={handleMoveComplete}
          disabled={!connected || !gameState.gameId || !gameState.isActive}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Move Complete
        </button>

        <button
          onClick={handleGameOver}
          disabled={!connected || !gameState.gameId || !gameState.isActive}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Game Over
        </button>
      </div>

      {/* Message Log */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Message Log</h2>
          <button
            onClick={clearMessages}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Log
          </button>
        </div>

        <div className="h-96 overflow-y-auto bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
          {messages.length === 0 ? (
            <div className="text-gray-500">No messages yet...</div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="mb-2 whitespace-pre-wrap">
                {message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
