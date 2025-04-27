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
import ReviewGame from "./Review";
import { Position, UserData } from "@/types/api";

export default function ReviewPage() {
  const { gameData } = useGameStore();
  const [whiteUserData, setWhiteUserData] = useState<UserData | null>(null);
  const [blackUserData, setBlackUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [wasGameOver, setWasGameOver] = useState(false);

  if (!gameData?.value) {
    notFound();
  }

  //* Filter, fetch and store the data related to users and the games for the next step
  useEffect(() => {
    async function loadGameData() {
      //* Initialize the states
      setLoading(true);
      setFetchError(null);
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
        currentPgn = gameData.value ?? "";
        const whiteMatch = currentPgn.match(/\[White "([^"]*)"\]/);
        const blackMatch = currentPgn.match(/\[Black "([^"]*)"\]/);

        if (whiteMatch) {
          setWhiteUserData({
            username: whiteMatch[1],
            flag: "UN",
          });
        }
        if (blackMatch) {
          setBlackUserData({
            username: blackMatch[1],
            flag: "UN",
          });
        }
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
          if (chess.isGameOver()) {
            setWasGameOver(true);
          }
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

  if (loading) {
    return <div>Loading</div>;
  }

  const placeholderUser = {
    flag: "UN",
    username: "Username",
    rating: "?"
  };

  return (
    <div className="h-full w-full">
      <ReviewGame
        positions={positions ?? []}
        gameOver={wasGameOver}
        whiteUserData={whiteUserData ?? placeholderUser}
        blackUserData={blackUserData ?? placeholderUser}
      />
      {fetchError && fetchError}
    </div>
  );
}
