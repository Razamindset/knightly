"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import UsernameForm from "@/components/username-form"
import Navbar from "@/components/navbar"
import { FaCheck, FaChevronLeft } from "react-icons/fa"

export default function SettingsPage() {
  const [usernames, setUsernames] = useState<{
    chesscom: string | null
    lichess: string | null
  }>({
    chesscom: null,
    lichess: null,
  })

  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load usernames from localStorage on mount
  useEffect(() => {
    const chesscomUsername = localStorage.getItem("chesscom_username")
    const lichessUsername = localStorage.getItem("lichess_username")

    setUsernames({
      chesscom: chesscomUsername,
      lichess: lichessUsername,
    })

    setLoading(false)
  }, [])

  // Handle username updates
  const handleUsernameSubmit = (platform: "chesscom" | "lichess", username: string) => {
    setUsernames((prev) => ({
      ...prev,
      [platform]: username,
    }))

    // Show success message
    setSuccessMessage(`Your ${platform === "chesscom" ? "Chess.com" : "Lichess"} username has been updated`)

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="text-gray-400 hover:text-white mr-4">
              <FaChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-center">
              <FaCheck className="h-5 w-5 text-green-500 mr-2" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Chess.com Account</h2>
              <p className="text-gray-400 mb-6">
                {usernames.chesscom ? `Current username: ${usernames.chesscom}` : "No Chess.com username set"}
              </p>
              <UsernameForm initialPlatform="chesscom" showPlatformSelector={false} onSubmit={handleUsernameSubmit} />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Lichess Account</h2>
              <p className="text-gray-400 mb-6">
                {usernames.lichess ? `Current username: ${usernames.lichess}` : "No Lichess username set"}
              </p>
              <UsernameForm initialPlatform="lichess" showPlatformSelector={false} onSubmit={handleUsernameSubmit} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
