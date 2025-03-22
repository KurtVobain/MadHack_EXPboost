import { create } from "zustand";

interface UserStore {
  balance: number;
  curBPExp: number;
  curBPLvl: number;
  curBPId: number;
  expirience: number;
  isPremium: boolean;
  userName: string;
  profileLevel: number;
  setUserState: (newState: UserStore) => void;
}

export const UserStore = create<UserStore>((set) => ({
  balance: 0,
  curBPExp: 0,
  curBPLvl: 0,
  curBPId: 0,
  expirience: 0,
  isPremium: false,
  userName: "",
  profileLevel: 0,
  setUserState: (newState: any) => set({
    balance: newState.balance,
    curBPExp: newState.current_battlepass_experience,
    curBPLvl: newState.current_battlepass_level,
    curBPId: newState.current_battlepass_id,
    expirience: newState.expirience,
    isPremium: newState.isPremium,
    userName: newState.userName,
    profileLevel: newState.profile_level,
  }),
}));