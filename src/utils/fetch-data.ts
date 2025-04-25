export async function fetchChesscomGame(
  id: string
): Promise<ChesscomGame | null> {
  try {

    console.log("heres");
    
    const response = await fetch(
      `https://www.chess.com/callback/game/live/${id}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    if (!data?.game) return null;

    const game = data.game;

    console.log(game);
    
    return {
      id,
      url: `https://www.chess.com/game/live/${id}`,
      time_class: game.time_class,
      time_control: game.time_control,
      rated: game.rated,
      white: {
        username: game.white.username,
        rating: game.white.rating,
        result: game.white.result,
      },
      black: {
        username: game.black.username,
        rating: game.black.rating,
        result: game.black.result,
      },
      end_time: game.end_time * 1000,
      pgn: game.pgn,
    };
  } catch (error) {
    console.error("Error fetching Chess.com game:", error);
    return null;
  }
}

export async function fetchLichessGame(
  id: string
): Promise<LichessGame | null> {
  try {
    const response = await fetch(`https://lichess.org/api/game/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Lichess game:", error);
    return null;
  }
}
