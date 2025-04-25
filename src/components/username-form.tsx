// ! Ai written code handle with intensive care

"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface UsernameFormProps {
  onSubmit?: (platform: "chesscom" | "lichess", username: string) => void
  initialPlatform?: "chesscom" | "lichess"
  showPlatformSelector?: boolean
}

export default function UsernameForm({
  onSubmit,
  initialPlatform = "chesscom",
  showPlatformSelector = true,
}: UsernameFormProps) {
  const [platform, setPlatform] = useState<"chesscom" | "lichess">(initialPlatform)
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  // Load usernames from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem(`${platform}_username`)
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [platform])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    // Basic validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    // Save to localStorage
    localStorage.setItem(`${platform}_username`, username)

    // Notify parent component if callback provided
    if (onSubmit) {
      onSubmit(platform, username)
    }

    setError("")
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit}>
        {showPlatformSelector && (
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Select Platform</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  platform === "chesscom" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setPlatform("chesscom")}
              >
                Chess.com
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  platform === "lichess" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setPlatform("lichess")}
              >
                Lichess
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="username" className="block text-gray-300 mb-2">
            {platform === "chesscom" ? "Chess.com" : "Lichess"} Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder={`Enter your ${platform === "chesscom" ? "Chess.com" : "Lichess"} username`}
          />
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
