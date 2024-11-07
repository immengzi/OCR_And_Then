import {create} from "zustand";
import {IFile} from "@/lib/types/IFile";

interface PlayState {
    file: IFile | null;
    currentTab: 'ocr' | 'answer' | 'summarize';
    contents: {
        ocr: string;
        answer: string;
        summarize: string;
    };
    isOcrCompleted: boolean;
}

interface PlayActions {
    setFile: (file: IFile | null) => void;
    setTab: (tab: PlayState['currentTab']) => void;
    setContent: (tab: PlayState['currentTab'], content: string) => void;
    setOcrCompleted: (completed: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState: PlayState = {
    file: null,
    currentTab: 'ocr',
    contents: {
        ocr: '',
        answer: '',
        summarize: ''
    },
    isOcrCompleted: false
};

export const usePlayStore = create<PlayState & PlayActions>((set) => ({
    ...initialState,
    setFile: (file) => set({file}),
    setTab: (currentTab) => set({currentTab}),
    setContent: (tab, content) => set((state) => ({
        contents: {
            ...state.contents,
            [tab]: content
        }
    })),
    setOcrCompleted: (isOcrCompleted) => set({isOcrCompleted}),
    reset: () => set(initialState)
}));