import { create } from "zustand";

export interface Award {
  amount: number;
  awardId: number;
  nftId: number;
}

export interface Level {
  id: number;
  level: number;
  experience: number;
  isPremium: boolean;
  status: string;
  awards: Award[];
}

interface UserStore {
  levels: Level[];
  setLevels: (newLevels: Level[]) => void;
}

export const BattlePassStore = create<UserStore>((set) => ({
  levels: [],
  setLevels: (newLevels) => set({ levels: newLevels }),
}));