"use client"

import type { Report } from "@/types/api"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import ChessgroundBoard from "@/components/Board/ChessgroundBoard";
import type { ClassificationConfig } from "./board-icons"
import { classificationIcons } from "./board-icons"
import { FaChessKnight } from "react-icons/fa6"
import useChessSounds from "@/utils/useSound"
import Image from "next/image"

interface ReviewReportProps {
  progress: number
  loading: boolean
  report?: Report | null
  initialFen?: string | null
}

export default function ReviewReport({ progress, loading, initialFen, report }: ReviewReportProps) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const moveListRef = useRef<HTMLDivElement>(null)
  const currentMoveRef = useRef<HTMLDivElement>(null)
  const { handleMoveSounds } = useChessSounds()


  const goToPreviousMove = useCallback(() => {
    if (report && currentMoveIndex > 0) {
      setCurrentMoveIndex((prev) => prev - 1)
    }
  }, [report, currentMoveIndex])

  const goToNextMove = useCallback(() => {
    if (report && currentMoveIndex < report.positions.length - 1) {
      setCurrentMoveIndex((prev) => prev + 1)
      handleMoveSounds(report.positions[currentMoveIndex + 1].move.san, report.positions[currentMoveIndex].fen)
    }
  }, [report, currentMoveIndex, handleMoveSounds])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPreviousMove()
      else if (e.key === "ArrowRight") goToNextMove()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPreviousMove, goToNextMove])

  useEffect(() => {
    if (currentMoveRef.current && moveListRef.current) {
      currentMoveRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      })
    }
  }, [currentMoveIndex])

  const currentMove = report?.positions[currentMoveIndex]

  const getSANClass = (classification: string | undefined) => {
    switch (classification?.toLowerCase()) {
      case "brilliant":
        return "text-[rgba(27, 172, 166, .7)] font-bold"
      case "great":
        return "text-[rgba(92, 139, 176, 1)] font-semibold"
      case "blunder":
        return "text-red-500 font-bold"
      default:
        return "text-white"
    }
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 p-2 sm:p-4 h-full">
      {/* Chess Board */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Suspense fallback={<FaChessKnight className="m-auto text-green-500 animate-pulse" size={35} />}>
          <ChessgroundBoard
            fen={
              loading && initialFen
                ? initialFen
                : currentMove?.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            }
            orientation="white"
            bestMoveArrow={currentMove?.topLines?.[0]?.moveUCI || currentMove?.move.uci}
            lastMove={currentMove?.move?.uci}
            allowArrows={!loading}
          />
        </Suspense>
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
            <p className="text-sm opacity-80">Analyzing moves and finding improvements</p>
          </div>
        ) : report ? (
          <div className="flex flex-col-reverse md:flex-col bg-gray-800 rounded-md text-white w-full h-full">
            {/* Current Move Display */}
            <div className="px-4 py-2 bg-gray-900 text-center text-lg font-semibold flex items-center justify-center gap-2">
              <span className={getSANClass(currentMove?.classification)}>
                {currentMove?.move.san || "Start Position"}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                ({currentMove?.classification || currentMove?.opening || "Error classifying"})
              </span>
              {classificationIcons[currentMove?.classification as keyof ClassificationConfig]?.emoji && (
                <Image
                  src={
                    classificationIcons[currentMove?.classification as keyof ClassificationConfig]?.emoji ||
                    "/placeholder.svg"
                  }
                  alt={currentMove?.classification || "Move"}
                  className="h-6 w-6"
                  loading="eager"
                  width={50}
                  height={50}
                />
              )}
            </div>

            <div className="report_data w-full p-4">
              Accuracies
              <div className="grid grid-cols-2 my-1">
                <div className="text-white font-semibold">White: {report.accuracies.white.toFixed(2)}</div>
                <div className="text-black font-semibold">Black: {report.accuracies.black.toFixed(2)}</div>
              </div>
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
                  className={`p-2 rounded-md cursor-pointer transition-colors text-center ${
                    pos.opening === "Starting Position" && "hidden"
                  } ${currentMoveIndex == index && "bg-gray-500"}`}
                >
                  <div className={getSANClass(pos.classification)}>{pos.move.san}</div>
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
              <div className="text-center">
                <p className="text-xs text-gray-400">Use arrow keys ← → to navigate</p>
                <p className="text-xs text-gray-500">Right-click and drag to draw arrows</p>
              </div>
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
  )
}
