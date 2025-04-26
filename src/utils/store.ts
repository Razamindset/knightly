import { create } from "zustand"

// Define the store
type GameData = {
  type: "url" | "pgn" | null
  value: string | null
}

type GameStore = {
  gameData: GameData
  setGameData: (data: GameData) => void
  clearGameData: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  gameData: { type: null, value: null },
  setGameData: (data) => set({ gameData: data }),
  clearGameData: () => set({ gameData: { type: null, value: null } }),
}))