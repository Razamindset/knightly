import { EvaluatedPosition, Position, Report, UserData } from "@/types/api";
import { Stockfish } from "@/utils/engine-new";
import { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import ReviewLoading from "./ReviewLoading";

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
  positions: Position[];
  gameOver: boolean;
  blackUserData: UserData;
  whiteUserData: UserData;
}) {
  const [report, setReport] = useState<Report | null>(null);
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

  async function fetchReport(allEvaluations: EvaluatedPosition[]) {
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
      setReport(gameReport.report.results);
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

        // If it's the last move and the game is over, add a placeholder evaluation
        if ((gameOver && i + 1 === totalMoves) || !currentFen) {
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
      await fetchReport(calculatedEvaluations); // Call fetchReport once
      setLoading(false);
    };

    if (positions) {
      setLoading(true); //start loading
      evaluateAndReport();
    }
  }, [positions, gameOver]);

  if (loading) {
    return (
      <ReviewLoading
        blackUser={blackUserData}
        progress={progress}
        whiteUser={whiteUserData}
      />
    );
  }

  return (
    <div className="border w-full p-6">
      <span>Progress: {progress}%</span>
      <div>{JSON.stringify(report && report.classifications)}</div>
      <div className="white">
        {whiteUserData?.username}{" "}
        <ReactCountryFlag countryCode={whiteUserData?.flag ?? "UN"} />
      </div>
      <div className="black">
        {blackUserData?.username}{" "}
        <ReactCountryFlag countryCode={blackUserData?.flag ?? "UN"} />
      </div>
    </div>
  );
}
