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
        model,
        setFile,
        setTab,
        setContent,
        setModel,
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
            const _file: IFile = result.file;
            setFile(_file);
            setTab('ocr');
            showSuccess('Upload successful');
            return true;
        } finally {
            hideLoading();
        }
    });

    const ocr = useErrorHandler(async (ocrFormData: OcrFormData) => {
        clearAlert();
        showLoading('Performing OCR...');

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
            throw AppError.BadRequest('OCR performing failed');
        }

        setDisplayMode('tabs');
        setTab('ocr');
        setModel(ocrFormData.model);
        hideLoading();

        await handleStreamResponse(response, (content) => {
            setContent('ocr', content);
        });

        setOcrCompleted(true);
        showSuccess('OCR performing successful');
        return true;
    });

    const answer = useErrorHandler(async (ocrResult: string) => {
        clearAlert();
        showLoading('Generating answer...');

        if (!user || !file) {
            throw AppError.BadRequest('User or file not found');
        }

        const response = await fetch('/api/play/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: ocrResult,
                model: model,
                userId: user._id,
                fileId: file._id
            })
        });

        if (!response.ok) {
            throw AppError.BadRequest('Answer performing failed');
        }

        setDisplayMode('tabs');
        setTab('answer');
        hideLoading();

        await handleStreamResponse(response, (content) => {
            setContent('answer', content);
        });

        showSuccess('Answer performing successful');
        return true;
    });

    const summary = useErrorHandler(async (ocrResult: string) => {
        clearAlert();
        showLoading('Generating summary...');

        if (!user || !file) {
            throw AppError.BadRequest('User or file not found');
        }

        const response = await fetch('/api/play/summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: ocrResult,
                model: model,
                userId: user._id,
                fileId: file?._id
            })
        });

        if (!response.ok) {
            throw AppError.BadRequest('Summary performing failed');
        }

        setDisplayMode('tabs');
        setTab('summary');
        hideLoading();

        await handleStreamResponse(response, (content) => {
            setContent('summary', content);
        });

        showSuccess('Summary performing successful');
        return true;
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
        upload,
        ocr,
        answer,
        summary
    };
}