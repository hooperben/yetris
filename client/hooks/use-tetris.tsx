import { useCallback, useEffect, useState, useRef } from "react";
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from "@/types";
import { useInterval } from "@/hooks/use-interval";
import {
  useTetrisBoard,
  hasCollisions,
  BOARD_HEIGHT,
  getEmptyBoard,
} from "@/hooks/use-tetris-board";

enum TickSpeed {
  Normal = 800,
  Sliding = 100,
  Fast = 50,
  HardDrop = 1,
}

export function useTetris() {
  const [score, setScore] = useState(0);
  const [upcomingBlocks, setUpcomingBlocks] = useState<Block[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  // WebSocket connection setup
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000"); // Update with your websocket URL
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsWsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleWebSocketMessage = useCallback(
    (data: any) => {
      switch (data.type) {
        case "gameStarted":
          const { gameId: newGameId, upcomingBlocks: initialBlocks } = data;
          setGameId(newGameId);
          setUpcomingBlocks(initialBlocks);
          setIsLoadingBlocks(false);
          // Start with the first block (index 0)
          dispatchBoardState({
            type: "start",
            firstBlock: initialBlocks[0],
          });
          break;

        case "moveCompleted":
          const { upcomingBlocks: updatedBlocks } = data;
          console.log("updatedBlocks:", updatedBlocks);
          setUpcomingBlocks(updatedBlocks);
          setIsLoadingBlocks(false);
          break;

        case "error":
          console.error("WebSocket error:", data.message);
          setIsLoadingBlocks(false);
          break;
      }
    },
    [dispatchBoardState],
  );

  const startGame = useCallback(() => {
    if (!isWsConnected || !wsRef.current) {
      console.error("WebSocket not connected");
      return;
    }

    setScore(0);
    setIsCommitting(false);
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    setIsLoadingBlocks(true);

    // Request initial blocks from server
    wsRef.current.send(
      JSON.stringify({
        type: "startGame",
      }),
    );
  }, [isWsConnected]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }

    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(
      newBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn,
    );

    let numCleared = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        numCleared++;
        newBoard.splice(row, 1);
      }
    }

    // Use the next block (index 1) as the new falling block
    const newBlock = upcomingBlocks[1];

    if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      setIsPlaying(false);
      setTickSpeed(null);

      // Notify server that game is over
      if (wsRef.current && gameId) {
        wsRef.current.send(
          JSON.stringify({
            type: "gameOver",
            gameId,
          }),
        );
      }
    } else {
      setTickSpeed(TickSpeed.Normal);
      setIsLoadingBlocks(true);

      // Request next block from server
      if (wsRef.current && gameId) {
        wsRef.current.send(
          JSON.stringify({
            type: "moveComplete",
            gameId,
          }),
        );
      }
    }

    setScore((prevScore) => prevScore + getPoints(numCleared));
    dispatchBoardState({
      type: "commit",
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [
    board,
    dispatchBoardState,
    droppingBlock,
    droppingColumn,
    droppingRow,
    droppingShape,
    upcomingBlocks,
    gameId,
  ]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    board,
    commitPosition,
    dispatchBoardState,
    droppingColumn,
    droppingRow,
    droppingShape,
    isCommitting,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, tickSpeed);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID: ReturnType<typeof setInterval> | undefined;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({
        type: "move",
        isPressingLeft,
        isPressingRight,
      });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({
          type: "move",
          isPressingLeft,
          isPressingRight,
        });
      }, 300);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.key === "ArrowDown") {
        setTickSpeed(TickSpeed.Fast);
      }

      if (event.key === " " || event.key === "Space") {
        setTickSpeed(TickSpeed.HardDrop);
      }

      if (event.key === "ArrowUp") {
        dispatchBoardState({
          type: "move",
          isRotating: true,
        });
      }

      if (event.key === "ArrowLeft") {
        isPressingLeft = true;
        updateMovementInterval();
      }

      if (event.key === "ArrowRight") {
        isPressingRight = true;
        updateMovementInterval();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setTickSpeed(TickSpeed.Normal);
      }

      if (event.key === "ArrowLeft") {
        isPressingLeft = false;
        updateMovementInterval();
      }

      if (event.key === "ArrowRight") {
        isPressingRight = false;
        updateMovementInterval();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(moveIntervalID);
      setTickSpeed(TickSpeed.Normal);
    };
  }, [dispatchBoardState, isPlaying]);

  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn,
    );
  }

  const nextBlock = upcomingBlocks.length > 1 ? upcomingBlocks[1] : null;

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
    score,
    nextBlock,
    isWsConnected,
    isLoadingBlocks,
  };
}

function getPoints(numCleared: number): number {
  switch (numCleared) {
    case 0:
      return 0;
    case 1:
      return 100;
    case 2:
      return 300;
    case 3:
      return 500;
    case 4:
      return 800;
    default:
      throw new Error("Unexpected number of rows cleared");
  }
}

function addShapeToBoard(
  board: BoardShape,
  droppingBlock: Block,
  droppingShape: BlockShape,
  droppingRow: number,
  droppingColumn: number,
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      row.forEach((isSet: boolean, colIndex: number) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] =
            droppingBlock;
        }
      });
    });
}
