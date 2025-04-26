"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaChessKnight, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { useGameStore } from "@/utils/store";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputType, setInputType] = useState<"url" | "pgn">("url");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setGameData } = useGameStore();

  // Add validation functions
  const validateChesscomUrl = (url: string): boolean => {
    return /^https?:\/\/(www\.)?chess\.com\/game\/(live|daily)\/\d+/.test(url);
  };

  const validateLichessUrl = (url: string): boolean => {
    return /^https?:\/\/(www\.)?lichess\.org\/([\w-]+)/.test(url);
  };

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

    try {
      // Validate input based on type
      if (inputType === "url") {
        if (
          !validateChesscomUrl(inputValue) &&
          !validateLichessUrl(inputValue)
        ) {
          setError(
            "Invalid URL. Please enter a valid Chess.com or Lichess game URL."
          );
          setLoading(false);
          return;
        }
      } else {
        if (!validatePgn(inputValue)) {
          setError("Invalid PGN format. Please check your PGN and try again.");
          setLoading(false);
          return;
        }
      }

      // Store the game data in Zustand store
      setGameData({
        type: inputType,
        value: inputValue,
      });

      // Navigate to the analysis page
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
      setInputValue(pgn);
      setInputType("pgn");
      setError(null);
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 max-w-xl mx-auto">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4">
          <FaChessKnight size={50} className="text-green-500 mx-auto" />
          <h1 className="text-4xl font-bold">Chess Review</h1>
          <p className="text-gray-400">
            Analyze chess games from Lichess, Chess.com, or PGN files
          </p>
        </div>

        <Tabs
          defaultValue="url"
          className="w-full"
          onValueChange={(value) => {
            setInputType(value as "url" | "pgn");
            setInputValue("");
            setError(null);
          }}
        >
          <TabsList className="grid grid-cols-2 mb-4 cursor-pointer">
            <TabsTrigger value="url" className="cursor-pointer">
              Game URL
            </TabsTrigger>
            <TabsTrigger value="pgn" className="cursor-pointer">
              PGN
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="url" className="space-y-4">
              <Input
                placeholder="Paste a Lichess or Chess.com game URL"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                className="w-full"
              />
              <div className="text-xs text-gray-400">
                Example: https://lichess.org/xxxxx or
                https://chess.com/game/live/xxxxx
              </div>
            </TabsContent>

            <TabsContent value="pgn" className="space-y-4">
              <Textarea
                placeholder="Paste PGN text here"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[150px]"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Or</span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 cursor-pointer"
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
            </TabsContent>

            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-md text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={!inputValue.trim() || loading}
            >
              {loading ? "Processing..." : "Analyze Game"}
            </Button>
          </form>
        </Tabs>
      </div>
    </main>
  );
}
