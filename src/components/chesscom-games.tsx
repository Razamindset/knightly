"use client";

import { useEffect, useState } from "react";
import GameCard from "./game-card";

interface ChesscomGame {
  id: string;
  url: string;
  time_class: string;
  time_control: string;
  rated: boolean;
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
  end_time: number;
  pgn: string;
}

interface ChesscomGamesProps {
  username: string;
}

export default function ChesscomGames({ username }: ChesscomGamesProps) {
  const [games, setGames] = useState<ChesscomGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError("");

      try {
        // Step 1: Fetch the list of archives (months) for the user
        const archivesRes = await fetch(
          `https://api.chess.com/pub/player/${username}/games/archives`
        );

        if (!archivesRes.ok) {
          throw new Error(
            `Failed to fetch archives: ${archivesRes.statusText}`
          );
        }

        const archivesData = await archivesRes.json();
        const archives: string[] = archivesData.archives;

        if (!archives || archives.length === 0) {
          setGames([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch games from the latest archive (most recent month)
        const latestArchive = archives[archives.length - 1];
        const gamesRes = await fetch(latestArchive);

        if (!gamesRes.ok) {
          throw new Error(`Failed to fetch games: ${gamesRes.statusText}`);
        }

        const gamesData = await gamesRes.json();

        // Map the API response to ChesscomGame[]
        const mappedGames: ChesscomGame[] = gamesData.games.map((game: any) => ({
          id: game.url.split("/").pop() || game.url,
          url: game.url,
          time_class: game.time_class,
          time_control: game.time_control,
          rated: game.rated,
          white: {
            username: game.white.username,
            rating: game.white.rating,
            result: game.white.result,
          },
          black: {
            username: game.black.username,
            rating: game.black.rating,
            result: game.black.result,
          },
          end_time: game.end_time * 1000, // convert to ms
          pgn: game.pgn,
        }));

        setGames(mappedGames);
      } catch (err) {
        console.error("Error fetching Chess.com games:", err);
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
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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
      <h2 className="text-xl font-semibold mb-4">Recent Games on Chess.com</h2>
      <div className="flex flex-col gap-0">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            platform="chesscom"
            white={game.white.username}
            black={game.black.username}
            result={
              game.white.username.toLowerCase() === username.toLowerCase()
                ? game.white.result
                : game.black.result
            }
            date={new Date(game.end_time).toLocaleDateString()}
            timeControl={game.time_control}
            timeClass={game.time_class}
            rated={game.rated}
            pgn={game.pgn}
          />
        ))}
      </div>
    </div>
  );
}
