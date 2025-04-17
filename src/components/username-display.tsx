"use client"

import type React from "react"

import { useState } from "react"

interface UsernameDisplayProps {
  platform: "chesscom" | "lichess"
  username: string | null
  onUpdateUsername: (platform: "chesscom" | "lichess", username: string) => void
}

export default function UsernameDisplay({ platform, username, onUpdateUsername }: UsernameDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(username || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUsername.trim() && newUsername !== username) {
      onUpdateUsername(platform, newUsername)
    }
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white text-sm"
          autoFocus
        />
        <button type="submit" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md">
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setNewUsername(username || "")
            setIsEditing(false)
          }}
          className="ml-2 bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded-md"
        >
          Cancel
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center text-sm text-gray-300">
      <span>
        {platform === "chesscom" ? "Chess.com" : "Lichess"} user: <strong>{username}</strong>
      </span>
      <button onClick={() => setIsEditing(true)} className="ml-2 text-blue-400 hover:text-blue-300">
        (change)
      </button>
    </div>
  )
}
