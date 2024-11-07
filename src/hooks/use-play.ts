import {IFile} from "@/lib/types/IFile";
import {useAuth} from "@/hooks/use-auth";
import {useAlert} from "@/hooks/use-alert";
import {useRouter} from "next/navigation";
import {useLoadingStore} from "@/store/slices/loading-slice";
import {usePlayStore} from "@/store/slices/play-slice";

export const usePlay = () => {
    const router = useRouter();
    const {user} = useAuth();
    const {show, clearAlert} = useAlert();
    const {showLoading, hideLoading} = useLoadingStore();
    const {setFile, setTab, setContent, setOcrCompleted, resetPlay} = usePlayStore();

    const showSuccess = (message: string) => show(message, 'success');
    const showError = (message: string) => show(message, 'error');

    const upload = async (file) => {
        try {
            resetPlay();
            clearAlert();

            if (!user) {
                showLoading('Please login first...');
                await new Promise(resolve => setTimeout(resolve, 1500));
                hideLoading();
                router.push('/login');
                return false;
            }

            showLoading('Uploading file...');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user._id);

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