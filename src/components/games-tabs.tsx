"use client";

import { useState } from "react";
import ChesscomGames from "./chesscom-games";
import LichessGames from "./lichess-games";

interface GamesTabsProps {
  usernames: {
    chesscom: string | null;
    lichess: string | null;
  };
}

export default function GamesTabs({ usernames }: GamesTabsProps) {
  const [activeTab, setActiveTab] = useState<"chesscom" | "lichess">(
    usernames.chesscom ? "chesscom" : "lichess"
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("chesscom")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === "chesscom"
                ? "bg-gray-800 text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Chess.com {usernames.chesscom ? "" : "(Not Set)"}
          </button>
          <button
            onClick={() => setActiveTab("lichess")}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activeTab === "lichess"
                ? "bg-gray-800 text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Lichess {usernames.lichess ? "" : "(Not Set)"}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        {activeTab === "chesscom" && usernames.chesscom ? (
          <ChesscomGames username={usernames.chesscom} />
        ) : activeTab === "lichess" && usernames.lichess ? (
          <LichessGames username={usernames.lichess} />
        ) : (
          <div className="max-w-md mx-auto py-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {activeTab === "chesscom" ? "Chess.com" : "Lichess"} Username Not
              Set
            </h2>
            <p className="text-gray-400 text-center">
              Please set your username in the profile menu to view your games.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}