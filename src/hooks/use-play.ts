import {IFile} from "@/lib/types/IFile";
import {AppError} from "@/lib/types/errors";
import {OcrFormData} from "@/lib/types";
import {useLoadingStore} from "@/store/slices/loading-slice";
import {usePlayStore} from "@/store/slices/play-slice";
import {useAuth} from "@/hooks/use-auth";
import {useAlert} from "@/hooks/use-alert";
import {useRouter} from "next/navigation";
import {useErrorHandler} from "@/components/layout/ErrorBoundary";

export const usePlay = () => {
    const router = useRouter();
    const {user} = useAuth();
    const {showSuccess, clearAlert} = useAlert();
    const {showLoading, hideLoading} = useLoadingStore();
    const {
        file,
        setFile,
        setTab,
        setContent,
        setOcrCompleted,
        setDisplayMode,
        resetPlay
    } = usePlayStore();

    const upload = useErrorHandler(async (file: File) => {
        clearAlert();
        resetPlay();
        showLoading('Uploading file...');

        try {
            if (!user) {
                showLoading('Please login first...');
                await new Promise(resolve => setTimeout(resolve, 1500));
                hideLoading();
                router.push('/login');
                return false;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user._id);

            const response = await fetch('/api/play/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw AppError.BadRequest();
            }

            const fileInfo: IFile = result;
            setFile(fileInfo);
            setTab('ocr');
            showSuccess('Upload successful');
            return true;
        } finally {
            hideLoading();
        }
    });

    const ocr = useErrorHandler(async (ocrFormData: OcrFormData) => {
        clearAlert();
        showLoading('Processing OCR...');

        if (!file || !user) {
            throw AppError.BadRequest('File or user not found');
        }

        const form = new FormData();
        if (ocrFormData.file) {
            form.append('file', ocrFormData.file, ocrFormData.file.name);
        }
        form.append('model', ocrFormData.model);

        const response = await fetch('/api/play/ocr', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw AppError.BadRequest('OCR processing failed');
        }

        setDisplayMode('tabs');
        setTab('ocr');
        hideLoading();

        await handleStreamResponse(response, (content) => {
            setContent('ocr', content);
        });

        setOcrCompleted(true);
        showSuccess('OCR processing successful');
        return true;
    });

    const answer = useErrorHandler(async (ocrResult: string) => {
    });

    const summarize = useErrorHandler(async (ocrResult: string) => {
    });

    async function handleStreamResponse(
        response: Response,
        onData: (content: string) => void
    ): Promise<string> {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        if (!reader) {
            throw AppError.BadRequest('Response body is not readable');
        }

        try {
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();

                        if (data === '[DONE]') {
                            return accumulatedContent;
                        }

                        const parsedData = JSON.parse(data);

                        if (parsedData.error) {
                            throw AppError.ServerError(parsedData.error);
                        }

                        if (parsedData.content) {
                            accumulatedContent += parsedData.content;
                            onData(parsedData.content);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return accumulatedContent;
    }

    return {
        upload,
        ocr,
        answer,
        summarize
    };
}