"use client";

import { useGameStore } from "@/utils/store";
import { notFound } from "next/navigation";

export default function ReviewPage() {
  const { gameData } = useGameStore();

  if (!gameData?.value) {
    notFound();
  }

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-3xl font-bold mb-8">Game Review</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Game Data from Store</h2>
        <div className="mb-2">
          <span className="font-semibold text-gray-300">Type:</span>{" "}
          <span className="text-gray-400">{gameData.type}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-300">Value:</span>
          <pre className="bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px] text-sm mt-2">
            {gameData.value}
          </pre>
        </div>
      </div>
    </div>
  );
}
