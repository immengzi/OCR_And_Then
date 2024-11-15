import {create} from "zustand";
import {IFile} from "@/lib/types/IFile";

interface PlayState {
    file: IFile | null;
    displayMode: 'upload' | 'tabs';
    currentTab: 'ocr' | 'answer' | 'summary';
    contents: {
        ocr: string;
        answer: string;
        summary: string;
    };
    model: string;
    isOcrCompleted: boolean;
}

interface PlayActions {
    setFile: (file: IFile | null) => void;
    setDisplayMode: (mode: PlayState['displayMode']) => void;
    setTab: (tab: PlayState['currentTab']) => void;
    setContent: (tab: PlayState['currentTab'], content: string) => void;
    setModel: (model: string) => void;
    setOcrCompleted: (completed: boolean) => void;
    resetPlay: () => void;
}

const initialState: PlayState = {
    file: null,
    displayMode: 'upload',
    currentTab: 'ocr',
    contents: {
        ocr: '',
        answer: '',
        summary: ''
    },
    model: 'gpt-4o-mini',
    isOcrCompleted: false
};

export const usePlayStore = create<PlayState & PlayActions>((set) => ({
    ...initialState,
    setFile: (file) => set({file}),
    setDisplayMode: (displayMode) => set({displayMode}),
    setTab: (currentTab) => set({currentTab}),
    setContent: (tab, content) => set((state) => ({
        contents: {
            ...state.contents,
            [tab]: content
        }
    })),
    setModel: (model) => set({model}),
    setOcrCompleted: (isOcrCompleted) => set({isOcrCompleted}),
    resetPlay: () => set(initialState)
}));