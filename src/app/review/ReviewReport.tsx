"use client";

import type { Report } from "@/types/api";
import { useState, useEffect, useRef, useCallback } from "react";
import ChessgroundBoard from "@/components/Board/ChessgroundBoard";
import useChessSounds from "@/utils/useSound";
import ReportHeader from "./components/ReportHeader";
import ReportAccuracies from "./components/ReportAccuracies";
// import BestMove from "./components/BestMove";
// import EngineLines from "./components/EngineLines";
import MovesGrid from "./components/MovesGrid";
import MoveControls from "./components/MoveControls";

import ReviewLoading from "./components/ReviewLoading";

interface ReviewReportProps {
  progress: number;
  loading: boolean;
  report?: Report | null;
  initialFen?: string | null;
}

export default function ReviewReport({
  progress,
  loading,
  initialFen,
  report,
}: ReviewReportProps) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const moveListRef = useRef<HTMLDivElement>(null);
  const currentMoveRef = useRef<HTMLDivElement>(null);
  const { handleMoveSounds } = useChessSounds();

  const goToPreviousMove = useCallback(() => {
    if (report && currentMoveIndex > 0) {
      setCurrentMoveIndex((prev) => prev - 1);
    }
  }, [report, currentMoveIndex]);

  const goToNextMove = useCallback(() => {
    if (report && currentMoveIndex < report.positions.length - 1) {
      setCurrentMoveIndex((prev) => prev + 1);
      handleMoveSounds(
        report.positions[currentMoveIndex + 1].move.san,
        report.positions[currentMoveIndex].fen
      );
    }
  }, [report, currentMoveIndex, handleMoveSounds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPreviousMove();
      else if (e.key === "ArrowRight") goToNextMove();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPreviousMove, goToNextMove]);

  useEffect(() => {
    if (currentMoveRef.current && moveListRef.current) {
      currentMoveRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [currentMoveIndex]);

  const currentMove = report?.positions[currentMoveIndex];

  const getSANClass = (classification: string | undefined) => {
    switch (classification?.toLowerCase()) {
      case "brilliant":
        return "text-[rgba(27, 172, 166, .7)] font-bold";
      case "great":
        return "text-[rgba(92, 139, 176, 1)] font-semibold";
      case "blunder":
        return "text-red-500 font-bold";
      default:
        return "text-white";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 p-2 sm:p-4 h-full">
      {/* Chess Board */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <ChessgroundBoard
          fen={
            loading && initialFen
              ? initialFen
              : currentMove?.fen ||
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          }
          orientation="white"
          bestMoveArrow={
            currentMove?.topLines?.[0]?.moveUCI || currentMove?.move.uci
          }
          lastMove={currentMove?.move?.uci}
          allowArrows={!loading}
        />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-auto">
        {loading ? (
          <ReviewLoading progress={progress} />
        ) : report ? (
          <div className="flex flex-col-reverse md:flex-col bg-gray-800 rounded-md text-white w-full h-full">
            <ReportHeader currentMove={currentMove} getSANClass={getSANClass} />
            <div className="flex flex-col p-4">
              {/* <BestMove currentMove={currentMove} /> */}
              {/* <EngineLi nes currentMove={currentMove} /> */}
              <ReportAccuracies report={report} />
            </div>
            <MovesGrid
              reportPositions={report.positions}
              currentMoveIndex={currentMoveIndex}
              setCurrentMoveIndex={setCurrentMoveIndex}
              moveListRef={moveListRef}
              currentMoveRef={currentMoveRef}
              getSANClass={getSANClass}
            />
            <MoveControls
              goToPreviousMove={goToPreviousMove}
              goToNextMove={goToNextMove}
              currentMoveIndex={currentMoveIndex}
              totalMoves={report.positions.length}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 bg-gray-800 rounded-md text-white w-full h-full">
            <p>Report data is not available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
