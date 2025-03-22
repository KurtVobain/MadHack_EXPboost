import { create } from "zustand";

interface userIdStore {
  userId: number;
  setUserId: (newUserId: number) => void;
}

export const userIdStore = create<userIdStore>((set) => ({
  userId: 0,
  setUserId: (newUserId) => set({ userId: newUserId }),
}));