import { EvaluatedPosition } from "@/types/api";

interface BestMoveProps {
  currentMove: EvaluatedPosition | undefined;
}

export default function BestMove({ currentMove }: BestMoveProps) {
  if (!currentMove?.topLines || currentMove.topLines.length === 0) {
    return null;
  }

  const bestMove = currentMove.topLines[0];

  return (
    <div className="p-4 bg-gray-700 rounded-md mb-4">
      <h4 className="text-lg font-semibold mb-2">Best Move</h4>
      <p className="text-green-400">{bestMove.moveUCI} (CP: {bestMove.evaluation.value})</p>
    </div>
  );
}
