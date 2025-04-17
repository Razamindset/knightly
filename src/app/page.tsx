"use client";

import { useEffect, useState } from "react";
import UsernameForm from "@/components/username-form";
import GamesTabs from "@/components/games-tabs";
import Navbar from "@/components/navbar";

export default function Home() {
  const [usernames, setUsernames] = useState<{
    chesscom: string | null;
    lichess: string | null;
  }>({
    chesscom: null,
    lichess: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load usernames from localStorage
    const chesscomUsername = localStorage.getItem("chesscom_username");
    const lichessUsername = localStorage.getItem("lichess_username");

    setUsernames({
      chesscom: chesscomUsername,
      lichess: lichessUsername,
    });

    setLoading(false);
  }, []);

  const handleUsernameSubmit = (
    platform: "chesscom" | "lichess",
    username: string
  ) => {
    localStorage.setItem(`${platform}_username`, username);

    setUsernames((prev) => ({
      ...prev,
      [platform]: username,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const hasUsernames = usernames.chesscom || usernames.lichess;

  return (
    <div className="min-h-screen flex  bg-gray-900 text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {!hasUsernames ? (
          <div className="max-w-md mx-auto mt-16">
            <h1 className="text-3xl font-bold text-center mb-8">
              Welcome to Chess Review
            </h1>
            <p className="text-gray-300 mb-8 text-center">
              To get started, please enter your Chess.com or Lichess username
            </p>
            <UsernameForm onSubmit={handleUsernameSubmit} />
          </div>
        ) : (
          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-8">Your Chess Games</h1>
            <GamesTabs
              usernames={usernames}
            />
          </div>
        )}
      </main>
    </div>
  );
}
