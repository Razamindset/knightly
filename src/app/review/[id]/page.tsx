import { fetchChesscomGame, fetchLichessGame } from "@/utils/fetch-data";
import { notFound } from "next/navigation";

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { platform?: string };
}) {
  const { id } = await params;
  const search_params = await searchParams;

  const platform   = search_params.platform;

  let gameData = null;  

  if (platform === "chesscom") {
    gameData = await fetchChesscomGame(id);
  } else if (platform === "lichess") {
    gameData = await fetchLichessGame(id);
  }

  if (!gameData) {
    notFound();
  }

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-3xl font-bold mb-8">Game Review</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Game Data</h2>
        <pre className="bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px] text-sm">
          {JSON.stringify(gameData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
