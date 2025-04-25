// ! Ai written code handle with intensive care

import { useState, useEffect } from "react"
import ChesscomGames from "./chesscom-games"
import LichessGames from "./lichess-games"
import UsernameForm from "./username-form"
import { SiChessdotcom, SiLichess } from "react-icons/si"

interface GamesTabsProps {
  usernames: {
    chesscom: string | null
    lichess: string | null
  }
}

export default function GamesTabs({ usernames: initialUsernames }: GamesTabsProps) {
  const [usernames, setUsernames] = useState(initialUsernames)
  const [activeTab, setActiveTab] = useState<"chesscom" | "lichess">(initialUsernames.chesscom ? "chesscom" : "lichess")

  useEffect(() => {
    const handleStorageChange = () => {
      setUsernames({
        chesscom: localStorage.getItem("chesscom_username"),
        lichess: localStorage.getItem("lichess_username"),
      })
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleUsernameSubmit = (platform: "chesscom" | "lichess", username: string) => {
    setUsernames((prev) => ({
      ...prev,
      [platform]: username,
    }))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("chesscom")}
            className={`p-2 flex gap-1 items-center cursor-pointer font-medium rounded-t-lg transition-colors ${
              activeTab === "chesscom"
                ? "bg-gray-800 text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
          <SiChessdotcom className="text-green-500"/>  Chess.com {usernames.chesscom ? "" : "(Not Set)"}
          </button>
          <button
            onClick={() => setActiveTab("lichess")}
            className={`p-2 flex gap-2 cursor-pointer items-center font-medium rounded-t-lg transition-colors ${
              activeTab === "lichess"
                ? "bg-gray-800 text-white border-b-2 border-green-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <SiLichess  className="text-white"/>
            Lichess {usernames.lichess ? "" : "(Not Set)"}
          </button>
        </div>
      </div>

      <div className="rounded-lg border box-color border-gray-700 p-6">
        {activeTab === "chesscom" && usernames.chesscom ? (
          <ChesscomGames username={usernames.chesscom} />
        ) : activeTab === "lichess" && usernames.lichess ? (
          <LichessGames username={usernames.lichess} />
        ) : (
          <div className="max-w-md mx-auto py-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {activeTab === "chesscom" ? "Chess.com" : "Lichess"} Username Not Set
            </h2>
            <UsernameForm initialPlatform={activeTab} showPlatformSelector={false} onSubmit={handleUsernameSubmit} />
          </div>
        )}
      </div>
    </div>
  )
}
