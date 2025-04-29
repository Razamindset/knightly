"use client";

import { Report } from "@/types/api";
import { FaSpinner } from "react-icons/fa";
import Board from "./Board";

interface ReviewLoadingProps {
  progress: number;
  loading: boolean;
  report?: Report | null;
}

export default function ReviewReport({ progress }: ReviewLoadingProps) {
  return (
    <div className="flex flex-wrap md:flex-nowrap w-full gap-4">
      <div className="md:w-1/2 w-full h-full flex flex-col items-center">
        <Board
          fen={"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"}
          lastMove={{
            from: "e2",
            to: "e4",
          }}
          moveClassification={"brilliant"}
        />
      </div>

      <div className="md:w-1/2 w-full h-screen flex items-center">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-md text-white w-full h-full">
          <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Calculating Review <FaSpinner className="animate-spin" />
          </h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <span className="w-full text-right">{progress}%</span>
          </div>
          <p className="text-sm opacity-80">
            Analyzing moves and finding improvements
          </p>
        </div>
      </div>
    </div>
  );
}
