import {IFile} from "@/lib/types/IFile";
import {PlayFormData} from "@/lib/types";
import {useLoadingStore} from "@/store/slices/loading-slice";
import {usePlayStore} from "@/store/slices/play-slice";
import {useAuth} from "@/hooks/use-auth";
import {useAlert} from "@/hooks/use-alert";
import {useRouter} from "next/navigation";
import {useErrorHandler} from "@/components/layout/ErrorBoundary";
import {AppError} from "@/lib/types/errors";

export const usePlay = () => {
    const router = useRouter();
    const {user} = useAuth();
    const {showSuccess, clearAlert} = useAlert();
    const {showLoading, hideLoading} = useLoadingStore();
    const {
        file,
        isOcrCompleted,
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

    const processOcrStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
        try {
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = new TextDecoder().decode(value);
                const lines = text.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(5);
                        if (data === '[DONE]') {
                            setOcrCompleted(true);
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.content || '';
                            fullContent += content;
                            setContent('ocr', fullContent);
                        } catch (e) {
                            console.error('Failed to parse OCR stream:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    };

    const ocr = async (playFormData: PlayFormData) => {
        clearAlert();
        showLoading('Processing OCR...');

        try {
            if (!file || !user) {
                throw AppError.BadRequest('File or user not found');
            }

            const form = new FormData();
            if (playFormData.file) {
                form.append('file', playFormData.file, playFormData.file.name);
            }
            form.append('model', playFormData.model);

            const response = await fetch('/api/play/ocr', {
                method: 'POST',
                body: form,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw AppError.BadRequest('OCR processing failed');
            }

            console.log('OCR result:', responseData);

            setDisplayMode('tabs');
            setTab('ocr');
            showSuccess('OCR processing successful');
            return true;
        } finally {
            hideLoading();
        }
    };

    return {
        file,
        isOcrCompleted,
        upload,
        ocr,
    };
}