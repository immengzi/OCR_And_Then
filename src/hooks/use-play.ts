import {IFile} from "@/lib/types/IFile";
import {usePlayStore} from "@/store/slices/play-slice";
import {useAlert} from "@/hooks/use-alert";
import {useLoadingStore} from "@/store/slices/loading-slice";

export const usePlay = () => {
    const {setFile, setTab, setContent, setOcrCompleted, reset} = usePlayStore();
    const {showLoading, hideLoading} = useLoadingStore();
    const {show, clearAlert} = useAlert();
    const showSuccess = (message: string) => show(message, 'success');
    const showWarning = (message: string) => show(message, 'warning');
    const showError = (message: string) => show(message, 'error');

    const upload = async (file, userId) => {
        try {
            reset();
            clearAlert();
            showLoading('Uploading file...');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);

            const response = await fetch('/api/play/upload', {
                method: 'POST',
                body: formData
            } as RequestInit);

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error.message || 'Upload failed');
            }

            const fileInfo: IFile = result.file;
            setFile(fileInfo);
            setTab('ocr');
            showSuccess('Upload successful');

            return true;
        } catch (error) {
            showError((error as Error).message || 'Upload failed');
            return false;
        } finally {
            hideLoading();
        }
    }

    return {
        upload
    }
}