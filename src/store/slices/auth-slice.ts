import {create} from "zustand"
import {IUser, LoginData, RegisterData} from "@/lib/types"

interface AuthState {
    user: IUser | null
    isLoading: boolean
    isLoggingOut: boolean
}

interface AuthActions {
    setUser: (user: IUser | null) => void
    setLoading: (isLoading: boolean) => void
    setLoggingOut: (isLoggingOut: boolean) => void
    register: (data: RegisterData) => Promise<boolean>
    login: (data: LoginData) => Promise<boolean>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    isLoading: true,
    isLoggingOut: false,
    setUser: (user) => set({user}),
    setLoading: (isLoading) => set({isLoading}),
    setLoggingOut: (isLoggingOut) => set({isLoggingOut})
}))