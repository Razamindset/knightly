import { useState } from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface GameCardProps {
  id: string;
  platform: "chesscom" | "lichess";
  white: string;
  black: string;
  result: string;
  date: string;
  timeControl: string;
  timeClass: string;
}

export default function GameCard({
  id,
  platform,
  white,
  black,
  result,
  date,
  timeControl,
  timeClass,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getPlatformUrl = () => {
    if (platform === "chesscom") return `https://www.chess.com/game/live/${id}`;
    return `https://lichess.org/${id}`;
  };

  return (
    <div
      className={`flex items-center border-b border-gray-700 p-3`}
    >
      <div className="flex-grow flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-sm text-white truncate w-24 ml-1">{white}</div>
          <span className="mx-2 text-gray-500">-</span>

          <div className="text-sm text-white truncate w-24 ml-1">{black}</div>
        </div>

        <div className="ml-4 text-sm text-gray-300 w-24 text-right">{date}</div>

        <div className="ml-4 text-xs text-gray-400 w-20 text-center flex flex-col ">
          <span className="items-center justify-center gap-2">
            {timeClass.charAt(0).toUpperCase() + timeClass.slice(1)}
          </span>
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <Link
            href={"/review/" + id}
            className="text-sm rounded-md font-semibold px-3 p-1 transition-colors bg-green-600 hover:bg-green-700"
          >
            Review
          </Link>
          <a
            href={getPlatformUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm rounded-md font-semibold transition-colors border px-2 p-1 flex items-center gap-2"
          >
           View
           <FaChevronRight />
          </a>
        </div>
      </div>
    </div>
  );
}
