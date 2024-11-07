import {useAuthStore} from '@/store/slices/auth-slice';
import {LoginSchema, RegisterSchema} from '@/lib/config/auth';
import {z} from 'zod';
import {LoginData, RegisterData} from '@/lib/types';
import {useRouter, useSearchParams} from "next/navigation";
import {useAlert} from '@/hooks/use-alert';
import {useLoadingStore} from "@/store/slices/loading-slice";

export const useAuth = () => {
    const router = useRouter();
    const {user, setUser} = useAuthStore();
    const {showLoading, hideLoading} = useLoadingStore();
    const {show, clearAlert} = useAlert();
    const showSuccess = (message: string) => show(message, 'success');
    const showWarning = (message: string) => show(message, 'warning');
    const showError = (message: string) => show(message, 'error');
    const searchParams = useSearchParams();

    const login = async (data: LoginData) => {
        clearAlert();
        showLoading('Logging in...');
        try {
            const validatedData = LoginSchema.parse(data);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            })
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error.message || 'Login failed');
            }

            setUser(result.data.user);
            showSuccess('Login successful');

            // 预留固定延时确保状态更新
            await new Promise(resolve => setTimeout(resolve, 300));
            const returnUrl = searchParams.get('returnUrl') || '/';
            await router.push(returnUrl);
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                showError('Invalid email or password format');
            } else {
                showError((error as Error).message || 'Login failed');
            }
            return false;
        } finally {
            hideLoading();
        }
    }

    const register = async (data: RegisterData) => {
        clearAlert();
        showLoading('Registering...');
        try {
            const validatedData = RegisterSchema.parse(data);

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            })
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error.message || 'Registration failed');
            }

            showSuccess('Registration successful');
            await new Promise(resolve => setTimeout(resolve, 300));
            router.push('/login');
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                showError('Invalid registration data');
            } else {
                showError((error as Error).message || 'Registration failed');
            }
            return false;
        } finally {
            hideLoading();
        }
    }

    const logout = async () => {
        clearAlert();
        showLoading('Logging out...');
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            })
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error.message || 'Logout failed');
            }

            setUser(null);
            await new Promise(resolve => setTimeout(resolve, 100));
            await router.push('/login');
            return true;
        } catch (error) {
            showError((error as Error).message || 'Logout failed');
            return false;
        } finally {
            hideLoading();
        }
    }

    const validateSession = async () => {
        clearAlert();
        showLoading('Validating session...');
        try {
            const response = await fetch('/api/auth/validate', {
                credentials: 'include'
            })
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error.message || 'Session validation failed');
            }

            setUser(result.data.user);
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
        } catch (error) {
            setUser(null);
            showWarning((error as Error).message || 'Session validation failed');
            return false;
        } finally {
            hideLoading();
        }
    }

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