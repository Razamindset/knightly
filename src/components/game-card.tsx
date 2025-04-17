"use client";

import { useState } from "react";
import Link from "next/link";
import { getCountryCode } from "../utils/country-codes"; // Make sure this file exists and returns ISO alpha-2 codes
import * as Flag from "country-flag-icons/react/3x2";

interface GameCardProps {
  id: string;
  platform: "chesscom" | "lichess";
  white: string;
  black: string;
  whiteCountry?: string | null;
  blackCountry?: string | null;
  result: string;
  date: string;
  timeControl: string;
  timeClass: string;
  rated: boolean;
  pgn: string;
}

export default function GameCard({
  id,
  platform,
  white,
  black,
  whiteCountry,
  blackCountry,
  result,
  date,
  timeControl,
  timeClass,
  rated,
  pgn,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getResultColor = () => {
    if (result === "win") return "text-green-400";
    if (result === "loss") return "text-red-400";
    return "text-yellow-400"; // draw or other
  };

  const getPlatformUrl = () => {
    if (platform === "chesscom") return `https://www.chess.com/game/live/${id}`;
    return `https://lichess.org/${id}`;
  };

  const getReviewUrl = () => {
    const encodedPgn = encodeURIComponent(pgn);
    return `/review?pgn=${encodedPgn}`;
  };

  const getFlag = (countryCode?: string | null) => {
    if (!countryCode) return null;
    const code = getCountryCode(countryCode)?.toUpperCase();
    if (!code) return null;

    const FlagComponent = (Flag as Record<string, React.ComponentType<{ width?: number }>>)[code];
    if (!FlagComponent) return null;

    return <FlagComponent width={16} />;
  };

  return (
    <div
      className={`flex items-center bg-gray-800 border-b border-gray-700 p-3 transition-colors duration-200 hover:bg-gray-700`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <div className="mr-4 w-12 text-center">
        <span className={getResultColor()}>{result}</span>
      </div> */}

      <div className="flex-grow flex items-center justify-between">
        <div className="flex items-center">
          {getFlag(whiteCountry)}
          <div className="text-sm text-white truncate w-24 ml-1">{white}</div>
          <span className="mx-2 text-gray-500">-</span>
          {getFlag(blackCountry)}
          <div className="text-sm text-white truncate w-24 ml-1">{black}</div>
        </div>

        <div className="ml-4 text-sm text-gray-300 w-24 text-right">{date}</div>

        <div className="ml-4 text-xs text-gray-400 w-20 text-right">
          {timeClass.charAt(0).toUpperCase() + timeClass.slice(1)}
        </div>

        <div className="ml-4 text-xs text-gray-400 w-16 text-right">
          {rated ? "Rated" : "Casual"}
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <Link
            href={getReviewUrl()}
            className="text-sm rounded-md font-semibold px-3 p-1 transition-colors bg-green-600 hover:bg-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Review
          </Link>
          <a
            href={getPlatformUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm rounded-md font-semibold px-3 p-1 transition-colors bg-blue-600 hover:bg-blue-700"
          >
            View Game
          </a>
        </div>
      </div>
    </div>
  );
}
