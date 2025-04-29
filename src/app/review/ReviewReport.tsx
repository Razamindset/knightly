"use client";

import type { Report } from "@/types/api";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Board from "./Board";
import type { ClassificationConfig } from "./board-icons";

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

  const goToPreviousMove = () => {
    if (report && currentMoveIndex > 0) {
      setCurrentMoveIndex((prev) => prev - 1);
    }
  };

  const goToNextMove = () => {
    if (report && currentMoveIndex < report.positions.length - 1) {
      setCurrentMoveIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPreviousMove();
      else if (e.key === "ArrowRight") goToNextMove();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMoveIndex, report]);

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
        <Board
          fen={
            loading && initialFen
              ? initialFen
              : currentMove?.fen ||
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          }
          lastMove={{
            from: currentMove?.move?.uci?.slice(0, 2) ?? "",
            to: currentMove?.move?.uci?.slice(2, 4) ?? "",
          }}
          moveClassification={
            (currentMove?.classification as keyof ClassificationConfig) ??
            "null"
          }
          boardSize={500}
        />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col h-[60vh] lg:h-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-800 rounded-md text-white w-full h-full">
            <h3 className="text-xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
              Calculating Review <Loader2 className="animate-spin" />
            </h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="w-full text-right text-sm">{progress}%</span>
            </div>
            <p className="text-sm opacity-80">
              Analyzing moves and finding improvements
            </p>
          </div>
        ) : report ? (
          <div className="flex flex-col-reverse md:flex-col bg-gray-800 rounded-md text-white w-full h-full">
            {/* Current Move Display */}
            <div className="px-4 py-2 bg-gray-900 text-center text-lg font-semibold hidden md:block">
              <span className={getSANClass(currentMove?.classification)}>
                {currentMove?.move.san || "Start Position"}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                (
                {currentMove?.classification ||
                  currentMove?.opening ||
                  "Error clasifying"}
                )
              </span>
            </div>

            {/* Move Grid */}
            <div
              ref={moveListRef}
              className="overflow-y-auto grid grid-cols-2 gap-2 p-4 flex-grow scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            >
              {report.positions.map((pos, index) => (
                <div
                  key={index}
                  ref={index === currentMoveIndex ? currentMoveRef : null}
                  onClick={() => setCurrentMoveIndex(index)}
                  className={
                    `p-2 rounded-md cursor-pointer transition-colors text-center ${pos.opening === "Starting Position" && "hidden"}`
                  }
                >
                  <div className={getSANClass(pos.classification)}>
                    {pos.move.san}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-t border-gray-700">
              <button
                onClick={goToPreviousMove}
                disabled={currentMoveIndex === 0}
                className="bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <p className="text-xs text-gray-400">
                Use arrow keys ← → to navigate
              </p>

              <button
                onClick={goToNextMove}
                disabled={currentMoveIndex === report.positions.length - 1}
                className="bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight size={18} />
              </button>
            </div>
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
