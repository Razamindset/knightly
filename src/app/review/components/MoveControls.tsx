import { ArrowLeft, ArrowRight } from "lucide-react";

interface MoveControlsProps {
  goToPreviousMove: () => void;
  goToNextMove: () => void;
  currentMoveIndex: number;
  totalMoves: number;
}

export default function MoveControls({
  goToPreviousMove,
  goToNextMove,
  currentMoveIndex,
  totalMoves,
}: MoveControlsProps) {
  return (
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
        disabled={currentMoveIndex === totalMoves - 1}
        className="bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
