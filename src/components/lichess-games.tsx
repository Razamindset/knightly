"use client";

import { useEffect, useState } from "react";
import GameCard from "./game-card";

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
      user: {
        name: string;
        rating: number;
      } | null;
      rating: number;
    };
    black: {
      user: {
        name: string;
        rating: number;
      } | null;
      rating: number;
    };
  };
  winner: "white" | "black" | null;
  pgn: string;
}

interface LichessGamesProps {
  username: string;
}

export default function LichessGames({ username }: LichessGamesProps) {
  const [games, setGames] = useState<LichessGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch recent games from Lichess API in JSON format
        // The endpoint returns NDJSON (newline-delimited JSON), so we parse it accordingly
        const response = await fetch(
          `https://lichess.org/api/games/user/${username}?max=10&opening=true&moves=false&tags=true&clocks=false&evals=false`,
          {
            headers: {
              Accept: "application/x-ndjson",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.statusText}`);
        }

        const text = await response.text();

        const lines = text.trim().split("\n");
        const parsedGames: LichessGame[] = lines.map((line) => {
          const game = JSON.parse(line);

          return {
            id: game.id,
            rated: game.rated,
            variant: game.variant,
            speed: game.speed,
            perf: game.perf,
            createdAt: game.createdAt,
            lastMoveAt: game.lastMoveAt,
            status: game.status,
            players: {
              white: {
                user: game.players.white.user || null,
                rating: game.players.white.rating,
              },
              black: {
                user: game.players.black.user || null,
                rating: game.players.black.rating,
              },
            },
            winner: game.winner || null,
            pgn: game.pgn,
          };
        });

        setGames(parsedGames);
      } catch (err) {
        console.error("Error fetching Lichess games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-gray-400">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No games found for this user.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Games on Lichess</h2>
      <div className="flex flex-col gap-0">
        {games.map((game) => {
          const isWhite = game.players.white.user?.name === username;
          const result = game.winner
            ? game.winner === (isWhite ? "white" : "black")
              ? "win"
              : "loss"
            : "draw";

          return (
            <GameCard
              key={game.id}
              id={game.id}
              platform="lichess"
              white={game.players.white.user?.name || "Anonymous"}
              black={game.players.black.user?.name || "Anonymous"}
              result={result}
              date={new Date(game.lastMoveAt).toLocaleDateString()}
              timeControl={game.speed}
              timeClass={game.speed}
              rated={game.rated}
              pgn={game.pgn}
            />
          );
        })}
      </div>
    </div>
  );
}
