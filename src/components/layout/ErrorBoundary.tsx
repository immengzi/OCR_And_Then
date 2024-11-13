import {useAlert} from "@/hooks/use-alert";
import {AppError} from "@/lib/types/errors";

export function useErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    const {showError, showWarning} = useAlert();

    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            if (error instanceof AppError) {
                switch (error.statusCode) {
                    case 400:
                        showError('Please check your input and try again');
                        break;
                    case 401:
                        showWarning('Please sign in to continue');
                        break;
                    case 403:
                        showError('You do not have access to this feature');
                        break;
                    case 404:
                        showError('The requested item could not be found');
                        break;
                    case 429:
                        showError('Please wait a moment before trying again');
                        break;
                    case 500:
                    default:
                        showError('Something went wrong on our end. Please try again');
                        break;
                }
            } else if (error instanceof Error) {
                console.error(error);
                showError('Oops! Something went wrong');
            } else {
                showError('We encountered an unexpected issue');
            }
            return false;
        }
    }) as T;
}