import { EvaluatedPosition, Position, Report } from "@/types/api";
import { Stockfish } from "@/utils/engine-new";
import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import StockfishLoader from "@/components/engine-loading";
import ReviewReport from "./ReviewReport";

/*
Loops over each positions to get its evaluation
shows a loading state until the evaluation is complete
when the evalution is done mounts the ReviewBoard comp 
*/
export default function ReviewAnalysis({
  positions,
}: {
  positions: Position[];
}) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isEngineReady, setIsEngineReady] = useState(false);

  const stockfish = useRef<Stockfish | null>(null);

  //* This useEffect for loading the engine
  useEffect(() => {
    const engine = new Stockfish();
    stockfish.current = engine;

    //* Donot proceed until the engine is loaded sucessfully
    engine.waitUntilReady().then(() => {
      setIsEngineReady(true);
    });

    return () => {
      if (stockfish.current) {
        stockfish.current.terminate();
        console.log("Stockfish worker terminated.");
      }
    };
  }, []);

  // Now we need to call the external api and get the game report
  async function fetchReport(allEvaluations: EvaluatedPosition[]) {
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
      const result = gameReport.report.results;
      setReport(result);
    } catch (error) {
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
      const calculatedEvaluations: EvaluatedPosition[] = [];

      for (let i = 0; i < totalMoves; i++) {
        setProgress(Math.round(((i + 1) / totalMoves) * 100));
        const currentFen = positions[i].after;

        const chess = new Chess(currentFen);
        // If it's the last move and the game is over, add a placeholder evaluation
        if ((chess.isGameOver() && i + 1 === totalMoves) || !currentFen) {
          calculatedEvaluations.push({
            move: { san: positions[i].san, uci: positions[i].lan },
            fen: currentFen,
            worker: "local",
            topLines: [],
          });
          continue; // Skip the Stockfish evaluation
        }

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

      await fetchReport(calculatedEvaluations);
      setLoading(false);
    };

    if (positions) {
      setLoading(true);
      evaluateAndReport();
    }
  }, [positions]);

  if (!isEngineReady) {
    return <StockfishLoader />;
  }

  return <ReviewReport progress={progress} loading={loading} report={report} />;
}
