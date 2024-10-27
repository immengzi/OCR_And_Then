import {create} from "zustand"
import {IUser} from "@/lib/types"

interface AuthState {
    user: IUser | null
    isLoading: boolean
    isLoggingOut: boolean
}

interface AuthActions {
    setUser: (user: IUser | null) => void
    setLoading: (isLoading: boolean) => void
    setLoggingOut: (isLoggingOut: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    isLoading: true,
    isLoggingOut: false,
    setUser: (user) => set({user}),
    setLoading: (isLoading) => set({isLoading}),
    setLoggingOut: (isLoggingOut) => set({isLoggingOut})
}))