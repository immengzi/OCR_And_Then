import {useAlertStore} from '@/store/slices/alert-slice';
import {IAlert} from "@/lib/types";

export const useAlert = () => {
    const {alert, showAlert, clearAlert} = useAlertStore();

    const show = (message: string, type: IAlert['type']) => {
        showAlert(type, message);
        setTimeout(clearAlert, 5000);
    }

    const showSuccess = (message: string) => show(message, 'success');
    const showError = (message: string) => show(message, 'error');
    const showWarning = (message: string) => show(message, 'warning');

    return {
        alert,
        show,
        showSuccess,
        showError,
        showWarning,
        clearAlert
    }
}