import { EvaluatedPosition } from "@/types/api";
import { RefObject } from "react";

interface MovesGridProps {
  reportPositions: EvaluatedPosition[];
  currentMoveIndex: number;
  setCurrentMoveIndex: (index: number) => void;
  moveListRef: RefObject<HTMLDivElement | null>;
  currentMoveRef: RefObject<HTMLDivElement | null>;
  getSANClass: (classification: string | undefined) => string;
}

export default function MovesGrid({
  reportPositions,
  currentMoveIndex,
  setCurrentMoveIndex,
  moveListRef,
  currentMoveRef,
  getSANClass,
}: MovesGridProps) {
  return (
    <div
      ref={moveListRef}
      className="overflow-y-auto grid grid-cols-2 p-1 flex-grow scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      {reportPositions.map((pos, index) => (
        <div
          key={index}
          ref={index === currentMoveIndex ? currentMoveRef : null}
          onClick={() => setCurrentMoveIndex(index)}
          className={`p-2 rounded-md cursor-pointer transition-colors text-center flex items-center gap-1 ${
            pos.opening === "Starting Position" && "hidden"
          } ${currentMoveIndex == index && "bg-gray-500"}`}
        >
          {index > 0 && (
            <span className="text-gray-400 text-xs mr-1">
              {Math.ceil(index / 2)}.
            </span>
          )}
          <div className={getSANClass(pos.classification)}>{pos.move.san}</div>
        </div>
      ))}
    </div>
  );
}
