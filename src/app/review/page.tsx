"use client";
import { useGameStore } from "@/utils/store";
import { Chess } from "chess.js";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Position } from "@/types/api";
import { FaChessKnight } from "react-icons/fa";
import ReviewAnalysis from "./ReviewAnalysis";

export default function ReviewPage() {
  const { gameData, setWhiteUserData, setBlackUserData } = useGameStore();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[] | null>(null);

  if (!gameData?.value) {
    notFound();
  }

  //* Filter and store the data related to users and the games for the next step
  useEffect(() => {
    // I have dropped support for url imports for now. The chess.com and lichess api is causing pain
    // Todo: Once this review page is done we can do all the fetching stuff before coming to this page
    async function loadGameData() {
      setLoading(true);
      setFetchError(null);

      let currentPgn = "";

      currentPgn = gameData.value ?? "";
      function extractPgnField(field: string): string {
        const match = currentPgn.match(new RegExp(`\\[${field} "([^"]*)"`));
        return match ? match[1] : "N/A";
      }

      setWhiteUserData({
        username: extractPgnField("White") || "WhitePlayer",
        flag: "PK",
        rating: extractPgnField("WhiteElo") || "3000",
        title: extractPgnField("WhiteTitle") || "None",
      });

      setBlackUserData({
        username: extractPgnField("Black") || "BlackPlayer",
        flag: "PK",
        rating: extractPgnField("BlackElo") || "3000",
        title: extractPgnField("BlackTitle") || "None",
      });

      //* Parse the pgn into individual positions
      if (currentPgn) {
        const chess = new Chess();
        try {
          chess.loadPgn(currentPgn);
          const moveHistory = chess.history({ verbose: true });

          // after is for the fen position for the board
          const historyWithInitial = [
            { after: moveHistory[0].before, opening: "Starting Position" },
            ...moveHistory,
          ];

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

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <FaChessKnight size={40} className="text-green-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReviewAnalysis positions={positions ?? []} />
      {fetchError && fetchError}
    </div>
  );
}
