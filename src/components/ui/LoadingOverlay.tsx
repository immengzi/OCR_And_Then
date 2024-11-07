import React from 'react';
import {Loader2} from 'lucide-react';
import {useLoadingStore} from "@/store/slices/loading-slice";

const LoadingOverlay = () => {
    const {isLoading, message} = useLoadingStore();

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Loading overlay"
        >
            <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
                <Loader2
                    className="animate-spin text-primary"
                    size={32}
                />
                <p className="text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;