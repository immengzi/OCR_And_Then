import {create} from "zustand";
import {IFile} from "@/lib/types/IFile";

interface PlayState {
    file: IFile | null
}

interface PlayActions {
    setFile: (file: IFile | null) => void
}

export const usePlayStore = create<PlayState & PlayActions>((set) => ({
    file: null,
    setFile: (file) => set({file})
}))