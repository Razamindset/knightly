import { Line } from "@/utils/engine-new";

interface UserData {
  username?: string;
  flag?: string;
  avatar?: string;
  rating?: string | "?"
  title?: string
}

export interface Position {
  opening?: string;
  san?: string;
  lan?: string;
  after?: string;
}

export enum Classification {
  BRILLIANT = "brilliant",
  GREAT = "great",
  BEST = "best",
  EXCELLENT = "excellent",
  GOOD = "good",
  INACCURACY = "inaccuracy",
  MISTAKE = "mistake",
  BLUNDER = "blunder",
  BOOK = "book",
  FORCED = "forced",
}

export interface EvaluatedMove {
  san?: string;
  uci?: string;
}

export interface EvaluatedPosition extends Position {
  move: EvaluatedMove;
  fen?: string;
  topLines: Line[];
  classification?: Classification;
  opening?: string;
  worker: string;
}

export interface Report {
  accuracies: {
    white: number;
    black: number;
  };
  classifications: {
    white: Record<Classification, number>;
    black: Record<Classification, number>;
  };
  positions: EvaluatedPosition[];
}
