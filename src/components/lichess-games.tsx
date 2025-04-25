// ! Ai written code handle with intensive care
"use client"

import { useEffect, useState } from "react"
import GameCard from "./game-card"
import { FaChevronDown } from "react-icons/fa"

export default function LichessGames({ username }: {username: string}) {
  // State management
  const [games, setGames] = useState<LichessGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const gamesPerPage = 10

  /**
   * Fetches games from the Lichess API
   */
  const fetchGames = async (pageNum: number) => {
    setLoading(true)
    setError("")

    try {
      // Fetch games from Lichess API in NDJSON format
      const response = await fetch(
        `https://lichess.org/api/games/user/${username}?max=${gamesPerPage}&opening=true&moves=false&tags=true&clocks=false&evals=false&page=${pageNum}`,
        {
          headers: {
            Accept: "application/x-ndjson",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.statusText}`)
      }

      const text = await response.text()

      // Parse NDJSON (each line is a separate JSON object)
      const lines = text.trim().split("\n")

      if (lines.length === 0 || (lines.length === 1 && lines[0] === "")) {
        // No more games to load
        setHasMore(false)
        if (pageNum === 1) {
          setGames([])
        }
        return
      }

      const parsedGames: LichessGame[] = lines.map((line) => {
        const game = JSON.parse(line)

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
        }
      })

      // If this is the first page, replace games; otherwise append
      if (pageNum === 1) {
        setGames(parsedGames)
      } else {
        setGames((prevGames) => [...prevGames, ...parsedGames])
      }

      // Check if we should show the "Load more" button
      setHasMore(parsedGames.length === gamesPerPage)
    } catch (err) {
      console.error("Error fetching Lichess games:", err)
      setError("Failed to load games. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initial data fetch on component mount or username change
   */
  useEffect(() => {
    setPage(1)
    fetchGames(1)
  }, [username])

  /**
   * Handles loading more games
   */
  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchGames(nextPage)
  }

  /**
   * Renders loading skeleton UI
   */
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={`skeleton-${i}`} className="bg-gray-800 rounded-lg p-4 animate-pulse">
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
  )

  /**
   * Renders error state UI
   */
  const renderError = () => (
    <div className="text-center py-12">
      <p className="text-red-400 mb-4">{error}</p>
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
        onClick={() => {
          setPage(1)
          fetchGames(1)
        }}
      >
        Retry
      </button>
    </div>
  )

  /**
   * Renders empty state UI
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-400">No games found for this user.</p>
    </div>
  )

  /**
   * Renders the list of games
   */
  const renderGames = () => (
    <>
      <div className="flex flex-col gap-2">
        {games.map((game, i) => {
          const isWhite = game.players.white.user?.name?.toLowerCase() === username.toLowerCase()
          const result = game.winner ? (game.winner === (isWhite ? "white" : "black") ? "win" : "loss") : "draw"

          return (
            <GameCard
              key={i}
              id={game.id}
              platform="lichess"
              white={game.players.white.user?.name || "Anonymous"}
              black={game.players.black.user?.name || "Anonymous"}
              result={result}
              date={new Date(game.lastMoveAt * 1000).toLocaleDateString()}
              timeControl={game.speed}
              timeClass={game.speed}
        
            />
          )
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                Load more games <FaChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </>
  )

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Games on Lichess</h2>

      {loading && page === 1 && renderLoadingSkeleton()}
      {error && renderError()}
      {!loading && !error && games.length === 0 && renderEmptyState()}
      {games.length > 0 && renderGames()}
    </div>
  )
}