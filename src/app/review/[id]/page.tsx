import { notFound } from "next/navigation";

// Define interfaces for the game data
interface ChesscomGame {
  url: string;
  pgn: string;
  time_class: string;
  time_control: string;
  rated: boolean;
  end_time: number;
  white: {
    username: string;
    rating: number;
    result: string;
  };
  black: {
    username: string;
    rating: number;
    result: string;
  };
  rules: string;
  termination?: string;
}

interface LichessGame {
  id: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: {
      user: { name: string; rating: number } | null;
      rating: number;
    };
    black: {
      user: { name: string; rating: number } | null;
      rating: number;
    };
  };
  winner: "white" | "black" | null;
  pgn: string;
}

// Helper function to determine if the ID is from Chess.com or Lichess
function determinePlatform(id: string): "chesscom" | "lichess" {
  // Lichess IDs are typically 8 characters
  if (id.length === 8) {
    return "lichess";
  }
  // Chess.com IDs are typically numeric
  return "chesscom";
}

// Fetch game data from Chess.com
async function fetchChesscomGame(id: string): Promise<ChesscomGame | null> {
  try {
    const response = await fetch(
      `https://www.chess.com/callback/game/live/${id}`
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.game;
  } catch (error) {
    console.error("Error fetching Chess.com game:", error);
    return null;
  }
}

// Fetch game data from Lichess
async function fetchLichessGame(id: string): Promise<LichessGame | null> {
  try {
    const response = await fetch(`https://lichess.org/api/game/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Lichess game:", error);
    return null;
  }
}

export default async function ReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const platform = determinePlatform(id);

  let gameData = null;

  if (platform === "chesscom") {
    gameData = await fetchChesscomGame(id);
  } else {
    gameData = await fetchLichessGame(id);
  }

  if (!gameData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Game Review</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Game Data</h2>
        <pre className="bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px] text-sm">
          {JSON.stringify(gameData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
