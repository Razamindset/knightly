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
  const [urlInputValue, setUrlInputValue] = useState("");
  const [pgnInputValue, setPgnInputValue] = useState("");
  const [inputType, setInputType] = useState<"url" | "pgn">("url");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setGameData } = useGameStore();

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

    let inputValueToSubmit = "";
    if (inputType === "url") {
      if (
        !validateChesscomUrl(urlInputValue) &&
        !validateLichessUrl(urlInputValue)
      ) {
        setError(
          "Invalid URL. Please enter a valid Chess.com or Lichess game URL."
        );
        setLoading(false);
        return;
      }
      inputValueToSubmit = urlInputValue;
    } else {
      if (!validatePgn(pgnInputValue)) {
        setError("Invalid PGN format. Please check your PGN and try again.");
        setLoading(false);
        return;
      }
      inputValueToSubmit = pgnInputValue;
    }

    try {
      setGameData({
        type: inputType,
        value: inputValueToSubmit,
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
      setInputType("pgn");
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
            Analyze chess games from Lichess, Chess.com, or PGN files
          </p>
        </div>

        <Tabs
          defaultValue="url"
          className="w-full"
          onValueChange={(value) => {
            setInputType(value as "url" | "pgn");
            setError(null);
          }}
        >
          <TabsList className="grid grid-cols-2 mb-4 cursor-pointer">
            <TabsTrigger value="url" className="cursor-pointer text-sm sm:text-base">
              Game URL
            </TabsTrigger>
            <TabsTrigger value="pgn" className="cursor-pointer text-sm sm:text-base">
              PGN
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <TabsContent value="url" className="space-y-4 w-full">
              <Input
                placeholder="Paste a Lichess or Chess.com game URL"
                value={urlInputValue}
                onChange={(e) => {
                  setUrlInputValue(e.target.value);
                  setError(null);
                }}
                className="w-full"
              />
              <div className="text-xs text-gray-500 sm:text-gray-400">
                Example: https://lichess.org/xxxxx or
                https://chess.com/game/live/xxxxx
              </div>
            </TabsContent>

            <TabsContent value="pgn" className="space-y-4 w-full">
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
            </TabsContent>

            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive rounded-md text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer text-sm sm:text-base"
              disabled={
                (inputType === "url" && !urlInputValue.trim()) ||
                (inputType === "pgn" && !pgnInputValue.trim()) ||
                loading
              }
            >
              {loading ? "Processing..." : "Analyze Game"}
            </Button>
          </form>
        </Tabs>
      </div>
    </main>
  );
}