"use client"

import { useEffect, useState } from "react"
import UsernameForm from "@/components/username-form"
import GamesTabs from "@/components/games-tabs"
import Navbar from "@/components/navbar"
import { FaChessKnight } from "react-icons/fa"

export default function Home() {
  const [usernames, setUsernames] = useState<{
    chesscom: string | null
    lichess: string | null
  }>({
    chesscom: null,
    lichess: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const chesscomUsername = localStorage.getItem("chesscom_username")
    const lichessUsername = localStorage.getItem("lichess_username")

    setUsernames({
      chesscom: chesscomUsername,
      lichess: lichessUsername,
    })

    setLoading(false)
  }, [])

  const handleUsernameSubmit = (platform: "chesscom" | "lichess", username: string) => {
    setUsernames((prev) => ({
      ...prev,
      [platform]: username,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse"><FaChessKnight size={40} className="text-green-500"/></div>
      </div>
    )
  }

  const hasUsernames = usernames.chesscom || usernames.lichess

  return (
    <div className="min-h-screen flex">
      <Navbar />

      <main className="container mx-auto p-4">
        {!hasUsernames ? (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Welcome to Chess Review</h1>
            <p className="text-gray-300 mb-8 text-center">
              To get started, please enter your Chess.com or Lichess username
            </p>
            <UsernameForm onSubmit={handleUsernameSubmit} />
          </div>
        ) : (
          <div>
            <GamesTabs usernames={usernames} />
          </div>
        )}
      </main>
    </div>
  )
}
