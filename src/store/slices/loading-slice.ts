import {create} from 'zustand';

interface LoadingState {
    isLoading: boolean;
    message: string;
}

interface LoadingActions {
    showLoading: (message?: string) => void;
    hideLoading: () => void;
    reset: () => void;
}

const initialState: LoadingState = {
    isLoading: false,
    message: ''
};

export const useLoadingStore = create<LoadingState & LoadingActions>((set) => ({
    ...initialState,
    showLoading: (message = 'Loading...') => set({isLoading: true, message}),
    hideLoading: () => set({isLoading: false, message: ''}),
    reset: () => set(initialState)
}));