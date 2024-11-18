import {AppError} from "@/lib/types/errors";
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
    const {checkCache, updateCache, setFile, setInput, setResult} = usePlayStore();

    const upload = useErrorHandler(async (file: File): Promise<string | null> => {
        clearAlert();
        showLoading('Uploading file...');

        if (!user) {
            showLoading('Please login first...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            hideLoading();
            router.push('/login');
            return null;
        }

        if (!file) {
            throw AppError.BadRequest('File not found');
        }

        setFile(file);

        const form = new FormData();
        form.append('file', file);
        form.append('userId', user._id);

        const response = await fetch('/api/play/upload', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw AppError.BadRequest('Upload failed');
        }

        const result = await response.json();
        const filePath = result.file.path;

        showLoading('Upload successful');
        return filePath;
    });

    const ocr = useErrorHandler(async (file: File): Promise<string | null> => {
        const filePath = await upload(file);
        if (!filePath) {
            return null;
        }

        if (!user) {
            showLoading('Please login first...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            hideLoading();
            router.push('/login');
            return null;
        }

        if (!file) {
            throw AppError.BadRequest('File not found');
        }

        showLoading('Performing OCR...');

        const form = new FormData();
        form.append('file', file);
        form.append('userId', user._id);
        form.append('filePath', filePath);

        const response = await fetch('/api/play/ocr', {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw AppError.BadRequest('OCR performing failed');
        }

        hideLoading();

        const result = await handleStreamResponse(response, (content) => {
            setInput(content);
        });
        showSuccess('OCR performing successful');
        return result;
    });

    const chat = useErrorHandler(async (prompt_type: string, content: string): Promise<string | null> => {
        const cachedResult = checkCache(prompt_type);
        if (cachedResult) {
            setResult(cachedResult);
            return cachedResult;
        }

        clearAlert();
        showLoading('Generating chat...');

        if (!user) {
            throw AppError.BadRequest('User or file not found');
        }

        const response = await fetch('/api/play/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt_type,
                content,
                userId: user._id
            })
        });

        if (!response.ok) {
            throw AppError.BadRequest('Chat generating failed');
        }

        hideLoading();

        const result = await handleStreamResponse(response, (content) => {
            setResult(content);
        });
        updateCache(prompt_type, result);
        showSuccess('Chat generating successful');
        return result;
    });

    async function handleStreamResponse(
        response: Response,
        onData: (content: string) => void
    ): Promise<string> {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        if (!reader) {
            throw AppError.BadRequest('Invalid response body');
        }

        try {
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            accumulatedContent += data.content;
                            onData(accumulatedContent);
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
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
        ocr,
        chat
    };
}