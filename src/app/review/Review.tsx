import { Stockfish } from "@/utils/engine-new";
import { useEffect, useRef, useState } from "react";
/*
Loops over each positions to get its evaluation
shows a loading state until the evaluation is complete
when the evalution is done mounts the ReviewBoard comp 
*/
export default function ReviewGame({
  positions,
  gameOver,
  whiteUserData,
  blackUserData,
}: {
  positions: any[];
  gameOver: boolean;
  blackUserData: any;
  whiteUserData: any;
}) {
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const stockfish = useRef<Stockfish | null>(null);

  // This one for loading the engine
  useEffect(() => {
    stockfish.current = new Stockfish();

    return () => {
      if (stockfish.current) {
        stockfish.current.terminate();
        console.log("Stockfish worker terminated.");
      }
    };
  }, []);

  async function fetchReport(allEvaluations: any[]) {
    console.log("This function was called");

    // Now we need to call the external api and get the game report
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allEvaluations),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API request failed: ${response.status} - ${errorData.error}`
        );
      }

      const gameReport = await response.json();
      setReport(gameReport.report);
    } catch (error: any) {
      console.error("Error during analysis or API call:", error);
    }
  }

  // Evaluate positions and fetch report
  useEffect(() => {
    const evaluateAndReport = async () => {
      if (!positions || positions.length === 0) {
        setLoading(false); // Ensure loading is false if no positions to evaluate
        return;
      }

      const totalMoves = positions.length;
      const calculatedEvaluations = [];

      for (let i = 0; i < totalMoves; i++) {
        setProgress(Math.round(((i + 1) / totalMoves) * 100));
        const currentFen = positions[i].after;

        // If it's the last move and the game is over, add a placeholder evaluation
        if (gameOver && i + 1 === totalMoves) {
          calculatedEvaluations.push({
            move: { san: positions[i].san, uci: positions[i].lan },
            fen: currentFen,
            worker: "local",
            topLines: [], // Or some other placeholder value
          });
          continue; // Skip the Stockfish evaluation
        }

        // console.log("Evaluating fen", currentFen);
        try {
          const evaluation = await stockfish?.current?.evaluate(currentFen, 16);
          if (evaluation) {
            calculatedEvaluations.push({
              move: { san: positions[i].san, uci: positions[i].lan },
              fen: currentFen,
              topLines: evaluation,
              worker: "local",
            });
          }
        } catch (error) {
          console.error(`Error evaluating position ${i}:`, error);
          // Handle error, perhaps add an empty evaluation or set a state
          calculatedEvaluations.push({
            move: { san: positions[i].san, uci: positions[i].lan },
            fen: currentFen,
            worker: "local",
            topLines: [], // Or some error marker
          });
        }
      }
      setLoading(false);
      await fetchReport(calculatedEvaluations); // Call fetchReport once
    };

    if (positions) {
      setLoading(true); //start loading
      evaluateAndReport();
    }
  }, [positions, gameOver]);

  return (
    <div className="border w-full p-6">
      Progress: {progress}%
      <div>{JSON.stringify(report && report.results.classifications)}</div>
    </div>
  );
}
