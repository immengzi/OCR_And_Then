import {create} from 'zustand';
import {MD5} from 'crypto-js';

interface CacheEntry {
    hash: string;
    [action: string]: string | number | undefined; // 动态存储 action 数据
    timestamp: number;
}

interface PlayState {
    input: string;
    result: string;
    file: File | null;
    cache: Map<string, CacheEntry>;
    currentHash: string | null;
}

interface PlayActions {
    setInput: (content: string) => void;
    setResult: (content: string) => void;
    setFile: (file: File | null) => void;
    updateCache: (action: string, content: string) => void;
    checkCache: (action: string) => string | null;
    clearCache: () => void;
    resetAll: () => void;
}

const CACHE_SIZE = 10;

const initialState: PlayState = {
    input: '',
    result: '',
    file: null,
    cache: new Map(),
    currentHash: null,
};

export const usePlayStore = create<PlayState & PlayActions>((set, get) => ({
    ...initialState,

    setInput: (content: string) => {
        const hash = MD5(content.trim()).toString();
        set({
            input: content,
            currentHash: hash,
        });
    },

    setResult: (content: string) => set({result: content}),

    setFile: (file: File | null) => set({file}),

    updateCache: (action: string, content: string) => {
        const state = get();
        const hash = state.currentHash;

        if (!hash) return;

        set((state) => {
            const cache = new Map(state.cache);
            let entry = cache.get(hash) || {
                hash,
                timestamp: Date.now(),
            };

            entry = {
                ...entry,
                [action]: content, // 动态设置 action 数据
                timestamp: Date.now(),
            };

            // 删除最旧的条目（如果缓存已满）
            if (cache.size >= CACHE_SIZE && !cache.has(hash)) {
                let oldest = Date.now();
                let oldestHash = '';

                cache.forEach((entry, key) => {
                    if (entry.timestamp < oldest) {
                        oldest = entry.timestamp;
                        oldestHash = key;
                    }
                });

                if (oldestHash) {
                    cache.delete(oldestHash);
                }
            }

            cache.set(hash, entry);

            return {cache};
        });
    },

    checkCache: (action: string): string | null => {
        const state = get();
        if (!state.currentHash) return null;

        const entry = state.cache.get(state.currentHash);
        if (!entry) return null;

        return (entry[action] as string) || null; // 检查动态 action 数据
    },

    clearCache: () => set({cache: new Map()}),

    resetAll: () => set(initialState),
}));
