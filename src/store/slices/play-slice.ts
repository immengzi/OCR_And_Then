import {create} from 'zustand';

interface ContentCache {
    answer: string;
    summary: string;
}

interface PlayState {
    input: string;
    result: string;
    file: File | null;
    contentCache: ContentCache;
}

interface PlayActions {
    setInput: (content: string) => void;
    setResult: (content: string) => void;
    setFile: (file: File | null) => void;
    updateCache: (type: keyof ContentCache, content: string) => void;
    clearCache: () => void;
    resetAll: () => void;
}

const initialState: PlayState = {
    input: '',
    result: '',
    file: null,
    contentCache: {
        answer: '',
        summary: ''
    }
};

export const usePlayStore = create<PlayState & PlayActions>((set) => ({
    ...initialState,
    setInput: (content: string) => set({input: content}),
    setResult: (content: string) => set({result: content}),
    setFile: (file: File | null) => set({file}),
    updateCache: (type: keyof ContentCache, content: string) =>
        set((state) => ({
            contentCache: {
                ...state.contentCache,
                [type]: content
            }
        })),
    clearCache: () => set({contentCache: initialState.contentCache}),
    resetAll: () => set(initialState)
}));