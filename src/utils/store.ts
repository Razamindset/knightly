import { UserData } from "@/types/api";
import { create } from "zustand";

// Define the store
type GameData = {
  type: "pgn" | null;
  value: string | null;
};

type GameStore = {
  gameData: GameData;
  whiteUserData: UserData | null;
  blackUserData: UserData | null;
  setGameData: (data: GameData) => void;
  setWhiteUserData: (data: UserData) => void;
  setBlackUserData: (data: UserData) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  gameData: { type: null, value: null },
  whiteUserData: null,
  blackUserData: null,
  setGameData: (data) => set({ gameData: data }),
  setWhiteUserData: (data) => set({ whiteUserData: data }),
  setBlackUserData: (data) => set({ blackUserData: data }),
}));
