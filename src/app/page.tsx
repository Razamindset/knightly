"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaChessKnight, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { useGameStore } from "@/utils/store";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [pgnInputValue, setPgnInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setGameData } = useGameStore();

  const validatePgn = (pgn: string): boolean => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    //* Check data format
    if (!validatePgn(pgnInputValue)) {
      setError("Invalid PGN format. Please check your PGN and try again.");
      setLoading(false);
      return;
    }

    try {
      setGameData({
        type: "pgn",
        value: pgnInputValue,
      });

      router.push("/review");
    } catch (error) {
      console.error("Error processing game data:", error);
      setError(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const pgn = event.target?.result as string;
      setPgnInputValue(pgn);
      setError(null);
    };
    reader.readAsText(file);
  };

  return (
    <main className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 max-w-xl mx-auto w-full h-full">
      <div className="space-y-8 w-full h-full">
        <div className="text-center space-y-4">
          <FaChessKnight size={50} className="text-green-500 mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-bold">Chess Review</h1>
          <p className="text-gray-500 sm:text-gray-400">
            Analyze chess games paste your pgn below
          </p>
        </div>

        {/* For some reason the lichess api fails in my browser so for now only pgn is availble */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="w-full">
            <Textarea
              placeholder="Paste PGN text here"
              value={pgnInputValue}
              onChange={(e) => {
                setPgnInputValue(e.target.value);
                setError(null);
              }}
              className="h-[150px] sm:h-[200px] w-full resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 sm:text-gray-400">Or</span>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <FaUpload size={14} />
              Upload PGN file
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pgn"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/20 border border-destructive rounded-md text-destructive-foreground text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer text-sm sm:text-base"
            disabled={!pgnInputValue.trim() || loading}
          >
            {loading ? "Processing..." : "Analyze Game"}
          </Button>
        </form>
      </div>
    </main>
  );
}
