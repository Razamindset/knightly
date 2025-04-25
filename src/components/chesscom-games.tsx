import { useEffect, useState } from "react";
import GameCard from "./game-card";
import { FaChevronDown } from "react-icons/fa";

/**
 * Type definitions for Chess.com API responses
 */
interface ChesscomArchivesResponse {
  archives: string[];
}

interface ChesscomGamesResponse {
  games: ChesscomGame[];
}

interface ChesscomGamesProps {
  username: string;
}

/**
 * Component to fetch and display Chess.com games for a user
 */
export default function ChesscomGames({ username }: ChesscomGamesProps) {
  // State management
  const [games, setGames] = useState<ChesscomGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleGames, setVisibleGames] = useState(10); // Default to showing 10 games
  const [hasMore, setHasMore] = useState(false);
  const [archives, setArchives] = useState<string[]>([]);
  const [currentArchiveIndex, setCurrentArchiveIndex] = useState(0);

  /**
   * Fetches archives and the most recent games for the user
   */
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

        const archivesData: ChesscomArchivesResponse = await archivesRes.json();

        if (!archivesData.archives || archivesData.archives.length === 0) {
          setGames([]);
          setLoading(false);
          return;
        }

        // Store all archives and set the current index to the most recent one
        const sortedArchives = [...archivesData.archives].sort((a, b) =>
          b.localeCompare(a)
        );
        setArchives(sortedArchives);
        setCurrentArchiveIndex(0);

        // Step 2: Fetch games from the latest archive (most recent month)
        await loadGamesFromArchive(sortedArchives[0]);
      } catch (err) {
        console.error("Error fetching Chess.com games:", err);
        setError("Failed to load games. Please try again later.");
        setLoading(false);
      }
    };

    fetchGames();
  }, [username]);

  /**
   * Loads games from a specific archive URL
   */
  const loadGamesFromArchive = async (archiveUrl: string) => {
    setLoading(true);

    try {
      const gamesRes = await fetch(archiveUrl);

      if (!gamesRes.ok) {
        throw new Error(`Failed to fetch games: ${gamesRes.statusText}`);
      }

      const gamesData: ChesscomGamesResponse = await gamesRes.json();

      // Map the API response to our internal format
      const mappedGames: ChesscomGame[] = gamesData.games.map((game) => ({
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

      // Sort games by date (newest first)
      mappedGames.sort((a, b) => b.end_time - a.end_time);

      setGames(mappedGames);
      setHasMore(
        currentArchiveIndex < archives.length - 1 ||
          mappedGames.length > visibleGames
      );
    } catch (err) {
      console.error("Error loading games from archive:", err);
      setError("Failed to load games from this time period.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads more games, either by showing more from the current archive
   * or by loading the next archive if we've shown all from the current one
   */
  const handleLoadMore = async () => {
    // If we haven't shown all games from the current archive yet
    if (visibleGames < games.length) {
      setVisibleGames((prev) => prev + 10);
      return;
    }

    // If we've shown all games from the current archive, load the next one
    if (currentArchiveIndex < archives.length - 1) {
      const nextIndex = currentArchiveIndex + 1;
      setCurrentArchiveIndex(nextIndex);
      await loadGamesFromArchive(archives[nextIndex]);
    }
  };

  /**
   * Renders loading skeleton UI
   */
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-5 bg-gray-700 rounded w-1/4"></div>
            <div className="h-5 bg-gray-700 rounded w-1/5"></div>
          </div>
        </div>
      ))}
    </div>
  );

  /**
   * Renders error state UI
   */
  const renderError = () => (
    <div className="text-center py-12">
      <p className="text-red-400 mb-4">{error}</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  /**
   * Renders empty state UI
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-400">No games found for this user.</p>
    </div>
  );

  /**
   * Renders the list of games
   */
  const renderGames = () => (
    <>
      <div className="flex flex-col gap-2">
        {games.slice(0, visibleGames).map((game) => (
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
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Load more games <FaChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Games on Chess.com</h2>

      {loading && renderLoadingSkeleton()}
      {error && renderError()}
      {!loading && !error && games.length === 0 && renderEmptyState()}
      {!loading && !error && games.length > 0 && renderGames()}
    </div>
  );
}
