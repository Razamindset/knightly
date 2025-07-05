import { EvaluatedPosition } from "@/types/api";

interface EngineLinesProps {
  currentMove: EvaluatedPosition | undefined;
}

export default function EngineLines({ currentMove }: EngineLinesProps) {
  if (!currentMove?.topLines || currentMove.topLines.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-700 rounded-md mb-4">
      <h4 className="text-lg font-semibold mb-2">Engine Lines</h4>
      <ul className="list-disc pl-5">
        {currentMove.topLines.map((line, index) => (
          <li key={index} className="text-sm text-gray-300">
            {line.moveUCI} (Eval: {line?.evaluation.value})
          </li>
        ))}
      </ul>
    </div>
  );
}
