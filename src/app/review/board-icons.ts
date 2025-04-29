// Classification Config
export interface Classification {
  emoji: string;
  color: string;
}

export interface ClassificationConfig {
  brilliant: Classification;
  great: Classification;
  best: Classification;
  excellent: Classification;
  good: Classification;
  inaccuracy: Classification;
  mistake: Classification;
  blunder: Classification;
  book: Classification;
  null: Classification;
}

export const classificationIcons:ClassificationConfig = {
  brilliant: {
    emoji: "/images/classifications/brilliant.png",
    color: "rgba(27, 172, 166, .7)",
  },
  great: {
    emoji: "/images/classifications/great.png",
    color: "rgba(92, 139, 176, 1)",
  },
  best: {
    emoji: "/images/classifications/best.png",
    color: "rgba(124, 168, 37, 0.7)",
  },
  excellent: {
    emoji: "/images/classifications/excellent.png",
    color: "rgba(152, 188, 96, 1)",
  },
  good: {
    emoji: "/images/classifications/good.png",
    color: "rgba(109, 164, 141, 1)",
  },
  inaccuracy: {
    emoji: "/images/classifications/inaccuracy.png",
    color: "rgba(247, 198, 49, 0.7)",
  },
  mistake: {
    emoji: "/images/classifications/mistake.png",
    color: "rgba(225, 141, 43, 1)",
  },
  blunder: {
    emoji: "/images/classifications/blunder.png",
    color: "rgba(193, 28, 28, .7)",
  },
  book: {
    emoji: "/images/classifications/book.png",
    color: "rgba(135, 114, 93, .7)",
  },
  null: { emoji: "⚠️", color: "rgba(217, 205, 62, 1)" },
};

// Piece Symbols
export interface GamePiece {
  [key: string]: string;
}

export const pieceSymbols: GamePiece = {
  p: "/images/pieces/bp.svg",
  n: "/images/pieces/bn.svg",
  b: "/images/pieces/bb.svg",
  r: "/images/pieces/br.svg",
  q: "/images/pieces/bq.svg",
  k: "/images/pieces/bk.svg",
  P: "/images/pieces/wp.svg",
  N: "/images/pieces/wn.svg",
  B: "/images/pieces/wb.svg",
  R: "/images/pieces/wr.svg",
  Q: "/images/pieces/wq.svg",
  K: "/images/pieces/wk.svg",
  "": "", // For empty piece
};
