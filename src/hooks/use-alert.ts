import {useAlertStore} from '@/store/slices/alert-slice';
import {IAlert} from "@/lib/types";

export const useAlert = () => {
    const {alert, showAlert, clearAlert} = useAlertStore();

    const show = (message: string, type: IAlert['type']) => {
        showAlert(type, message);
        setTimeout(clearAlert, 5000);
    }

    return {
        alert,
        show,
        clearAlert
    }
}