"use client";

import {
  fetchLichessGameData,
  fetchLichessGameId,
  fetchLichessUserData,
} from "@/utils/fetch-lichess-data";
import { getPlatformAndId } from "@/utils/get-platform";
import { useGameStore } from "@/utils/store";
import { Chess } from "chess.js";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const { gameData } = useGameStore();
  const [gamePgn, setGamePgn] = useState<string | null>(null);
  const [whiteUserData, setWhiteUserData] = useState<any | null>(null);
  const [blackUserData, setBlackUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [postions, setPositions] = useState<any[] | null>(null);

  if (!gameData?.value) {
    notFound();
  }

  //* Filter, fetch and store the data related to users and the games for the next step
  useEffect(() => {
    async function loadGameData() {
      //* Initialize the states
      setLoading(true);
      setFetchError(null);
      setGamePgn(null);
      setWhiteUserData(null);
      setBlackUserData(null);

      let currentPgn = "";

      if (gameData.type === "url") {
        const { platform, id: urlId } = getPlatformAndId(gameData.value!);

        if (platform === "lichess" && urlId) {
          // the id in th url is not the actual gameID
          const gameId = await fetchLichessGameId(urlId);
          const data = await fetchLichessGameData(gameId);

          if (data) {
            setGamePgn(data);
            currentPgn = data;
            // Extract user IDs from PGN (very basic approach, might need more robust parsing)
            const whiteMatch = data.match(/\[White "([^"]*)"\]/);
            const blackMatch = data.match(/\[Black "([^"]*)"\]/);

            if (whiteMatch && whiteMatch[1]) {
              fetchLichessUserData(whiteMatch[1]).then((data) => {
                setWhiteUserData({
                  username: data.username,
                  flag: data.profile.flag,
                  avatar: data.profile.avatar,
                });
              });
            }
            if (blackMatch && blackMatch[1]) {
              fetchLichessUserData(blackMatch[1]).then((data) => {
                setBlackUserData({
                  username: data.username,
                  flag: data.profile.flag,
                  avatar: data.profile.avatar,
                });
              });
            }
          } else {
            setFetchError("Failed to fetch game data from Lichess.");
          }
        } else if (platform === "chesscom" && urlId) {
          setFetchError(
            "Chess.com analysis is currently in development. Please import using PGN}"
          );
        } else {
          setFetchError("Invalid game URL.");
        }
      } else if (gameData.type === "pgn") {
        setGamePgn(gameData.value);
        currentPgn = gameData.value ?? "";
      }

      if (currentPgn) {
        const chess = new Chess();
        try {
          // Now we will load get the individual positions
          chess.loadPgn(currentPgn);
          const moveHistory = chess.history({ verbose: true });

          // after is for the fen position for the board
          const historyWithInitial = [
            { after: moveHistory[0].before, opening: "Starting Position" },
            ...moveHistory,
          ];

          // For now we don't know what feilds we need for future so we will store all of them
          setPositions(historyWithInitial);
        } catch (error) {
          console.error("Error loading PGN:", error);
          setFetchError("Invalid PGN format.");
          setPositions([]);
        }
      }

      setLoading(false);
    }

    loadGameData();
  }, [gameData]);

  console.log(postions);

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-3xl font-bold mb-8">Game Review</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Game Data</h2>
        {loading ? (
          <p className="text-gray-400">Loading game data...</p>
        ) : fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : gamePgn ? (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Game PGN
              </h3>
              <pre className="bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px] text-sm mt-2">
                {gamePgn}
              </pre>
            </div>
            {whiteUserData && (
              <div className="mb-2">
                <span className="font-semibold text-gray-300">White:</span>{" "}
                <span className="text-gray-400">{whiteUserData.username}</span>{" "}
                {whiteUserData.rating && (
                  <span className="text-gray-500">
                    ({whiteUserData.rating})
                  </span>
                )}
              </div>
            )}
            {blackUserData && (
              <div>
                <span className="font-semibold text-gray-300">Black:</span>{" "}
                <span className="text-gray-400">{blackUserData.username}</span>{" "}
                {blackUserData.rating && (
                  <span className="text-gray-500">
                    ({blackUserData.rating})
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No game data available.</p>
        )}
      </div>
    </div>
  );
}
