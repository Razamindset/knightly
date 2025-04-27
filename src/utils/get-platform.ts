// Returns the platform name and id for the game URL
export function getPlatformAndId(url: string): {
  platform: "lichess" | "chesscom" | null;
  id: string | null;
} {
  const lichessRegex = /^https?:\/\/(www\.)?lichess\.org\/([\w-]+)/;
  const chesscomLiveRegex = /^https?:\/\/(www\.)?chess\.com\/game\/live\/(\d+)/;
  const chesscomDailyRegex =
    /^https?:\/\/(www\.)?chess\.com\/game\/daily\/(\d+)/;

  const lichessMatch = url.match(lichessRegex);
  if (lichessMatch) {
    return { platform: "lichess", id: lichessMatch[2] };
  }

  const chesscomLiveMatch = url.match(chesscomLiveRegex);
  if (chesscomLiveMatch) {
    return { platform: "chesscom", id: chesscomLiveMatch[2] };
  }

  const chesscomDailyMatch = url.match(chesscomDailyRegex);
  if (chesscomDailyMatch) {
    return { platform: "chesscom", id: chesscomDailyMatch[2] };
  }

  return { platform: null, id: null };
}

