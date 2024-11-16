import {useAuth} from "@/hooks/use-auth";
import {AppError} from "@/lib/types/errors";

export const useHistory = () => {
    const {user} = useAuth();
    const getHistory = async () => {
        if (!user?._id) throw new Error('User not authenticated');

        const response = await fetch(`/api/user/history/${user._id}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw AppError.BadRequest('Failed to get history');
        }

        const {history} = await response.json();
        return history;
    };
    return {
        getHistory
    }
}