import { StaticImageData } from 'next/image';

export interface Classification {
  emoji: StaticImageData | string;
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

import brilliantEmoji from './assets/images/classifications/brilliant.png';
import greatEmoji from './assets/images/classifications/great.png';
import bestEmoji from './assets/images/classifications/best.png';
import excellentEmoji from './assets/images/classifications/excellent.png';
import goodEmoji from './assets/images/classifications/good.png';
import inaccuracyEmoji from './assets/images/classifications/inaccuracy.png';
import mistakeEmoji from './assets/images/classifications/mistake.png';
import blunderEmoji from './assets/images/classifications/blunder.png';
import bookEmoji from './assets/images/classifications/book.png';

export const classificationIcons: ClassificationConfig = {
  brilliant: {
    emoji: brilliantEmoji,
    color: "rgba(27, 172, 166, .7)",
  },
  great: {
    emoji: greatEmoji,
    color: "rgba(92, 139, 176, 1)",
  },
  best: {
    emoji: bestEmoji,
    color: "rgba(124, 168, 37, 0.7)",
  },
  excellent: {
    emoji: excellentEmoji,
    color: "rgba(152, 188, 96, 1)",
  },
  good: {
    emoji: goodEmoji,
    color: "rgba(109, 164, 141, 1)",
  },
  inaccuracy: {
    emoji: inaccuracyEmoji,
    color: "rgba(247, 198, 49, 0.7)",
  },
  mistake: {
    emoji: mistakeEmoji,
    color: "rgba(225, 141, 43, 1)",
  },
  blunder: {
    emoji: blunderEmoji,
    color: "rgba(193, 28, 28, .7)",
  },
  book: {
    emoji: bookEmoji,
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
