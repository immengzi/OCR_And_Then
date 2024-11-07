import {create} from "zustand";
import {IUser} from "@/lib/types";

interface AuthState {
    user: IUser | null,
}

interface AuthActions {
    setUser: (user: IUser | null) => void,
    reset: () => void
}

const initialState = {
    user: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    ...initialState,
    setUser: (user) => set({user}),
    reset: () => set(initialState)
}))