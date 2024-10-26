import {create} from "zustand"
import {IAlert} from "@/lib/types"

interface AlertState {
    alert: IAlert | null
}

interface AlertActions {
    setAlert: (alert: IAlert | null) => void
    showAlert: (type: IAlert['type'], message: string, showAfterRedirect?: boolean) => void
    clearAlert: () => void
}

export const useAlertStore = create<AlertState & AlertActions>((set) => ({
    alert: null,
    setAlert: (alert) => set({alert}),
    showAlert: (type, message, showAfterRedirect = false) =>
        set({alert: {type, message, showAfterRedirect}}),
    clearAlert: () => set((state) => ({
        alert: state.alert?.showAfterRedirect
            ? {...state.alert, showAfterRedirect: false}
            : null
    }))
}))