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
}

export const classificationIcons: ClassificationConfig = {
  brilliant: {
    emoji: '/assets/images/classifications/brilliant.png',
    color: "rgba(27, 172, 166, .7)",
  },
  great: {
    emoji: '/assets/images/classifications/great.png',
    color: "rgba(92, 139, 176, 1)",
  },
  best: {
    emoji: '/assets/images/classifications/best.png',
    color: "rgba(124, 168, 37, 0.7)",
  },
  excellent: {
    emoji: '/assets/images/classifications/excellent.png',
    color: "rgba(152, 188, 96, 1)",
  },
  good: {
    emoji: '/assets/images/classifications/good.png',
    color: "rgba(109, 164, 141, 1)",
  },
  inaccuracy: {
    emoji: '/assets/images/classifications/inaccuracy.png',
    color: "rgba(247, 198, 49, 0.7)",
  },
  mistake: {
    emoji: '/assets/images/classifications/mistake.png',
    color: "rgba(225, 141, 43, 1)",
  },
  blunder: {
    emoji: '/assets/images/classifications/book.png',
    color: "rgba(193, 28, 28, .7)",
  },
  book: {
    emoji: '/assets/images/classifications/book.png',
    color: "rgba(135, 114, 93, .7)",
  },
};
