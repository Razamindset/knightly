
interface ChesscomGame {
    id: string
    url: string
    time_class: string
    time_control: string
    rated: boolean
    white: {
      username: string
      rating: number
      result: string
    }
    black: {
      username: string
      rating: number
      result: string
    }
    end_time: number
    pgn: string
  }

interface LichessGame {
  id: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: {
      user: { name: string; rating: number } | null;
      rating: number;
    };
    black: {
      user: { name: string; rating: number } | null;
      rating: number;
    };
  };
  winner: "white" | "black" | null;
  pgn: string;
}
