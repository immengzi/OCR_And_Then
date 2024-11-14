import {AppError} from "@/lib/types/errors";
import {LoginData, RegisterData} from '@/lib/types';
import {useAuthStore} from '@/store/slices/auth-slice';
import {useLoadingStore} from "@/store/slices/loading-slice";
import {LoginSchema, RegisterSchema} from '@/lib/config/auth';
import {useRouter, useSearchParams} from "next/navigation";
import {useAlert} from '@/hooks/use-alert';
import {useErrorHandler} from "@/components/layout/ErrorBoundary";

export const useAuth = () => {
    const router = useRouter();
    const {user, setUser} = useAuthStore();
    const {showLoading, hideLoading} = useLoadingStore();
    const {showSuccess, clearAlert} = useAlert();
    const searchParams = useSearchParams();

    const login = useErrorHandler(async (data: LoginData) => {
        clearAlert();
        showLoading('Logging in...');

        try {
            const validatedData = LoginSchema.parse(data);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw AppError.BadRequest();
            }

            setUser(responseData);
            showSuccess('Login successful');

            await new Promise(resolve => setTimeout(resolve, 300));
            const returnUrl = searchParams.get('returnUrl') || '/';
            router.push(returnUrl);
            return true;
        } finally {
            hideLoading();
        }
    });

    const register = useErrorHandler(async (data: RegisterData) => {
        clearAlert();
        showLoading('Registering...');

        try {
            const validatedData = RegisterSchema.parse(data);

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            });

            if (!response.ok) {
                throw AppError.BadRequest();
            }

            showSuccess('Registration successful');
            await new Promise(resolve => setTimeout(resolve, 300));
            router.push('/login');
            return true;
        } finally {
            hideLoading();
        }
    });

    const logout = useErrorHandler(async () => {
        clearAlert();
        showLoading('Logging out...');

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            if (!response.ok) {
                throw AppError.BadRequest();
            }

            setUser(null);
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push('/login');
            return true;
        } finally {
            hideLoading();
        }
    });

    const validateSession = useErrorHandler(async () => {
        clearAlert();
        showLoading('Validating session...');

        try {
            const response = await fetch('/api/auth/validate', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw AppError.Unauthorized();
            }

            const result = await response.json();
            setUser(result);
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
        } finally {
            hideLoading();
        }
    });

    return {
        user: user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        login,
        register,
        logout,
        validateSession
    }
}