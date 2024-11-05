import {useAuthStore} from '@/store/slices/auth-slice'
import {LoginSchema, RegisterSchema} from '@/lib/config/auth'
import {z} from 'zod'
import {LoginData, RegisterData} from '@/lib/types'
import {useRouter, useSearchParams} from "next/navigation"
import {useAlert} from '@/hooks/use-alert'

export const useAuth = () => {
    const router = useRouter()
    const {user, isLoading, isLoggingOut, setLoading, setUser, setLoggingOut} = useAuthStore()
    const {show, clearAlert} = useAlert()
    const showSuccess = (message: string) => show(message, 'success')
    const showWarning = (message: string) => show(message, 'warning')
    const showError = (message: string) => show(message, 'error')
    const searchParams = useSearchParams();

    const login = async (data: LoginData) => {
        setLoading(true)
        clearAlert()

        try {
            const validatedData = LoginSchema.parse(data)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error.message || 'Login failed')
            }

            setUser(result.data.user);
            showSuccess('Login successful');

            // 预留固定延时确保状态更新
            await new Promise(resolve => setTimeout(resolve, 300))
            const returnUrl = searchParams.get('returnUrl') || '/';
            setLoading(false)
            await router.push(returnUrl)
            return true
        } catch (error) {
            setLoading(false)
            if (error instanceof z.ZodError) {
                showError('Invalid email or password format')
            } else {
                showError((error as Error).message || 'Login failed')
            }
            return false
        }
    }

    const register = async (data: RegisterData) => {
        setLoading(true)
        clearAlert()

        try {
            const validatedData = RegisterSchema.parse(data)

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error.message || 'Registration failed')
            }

            showSuccess('Registration successful')
            await new Promise(resolve => setTimeout(resolve, 300))
            setLoading(false)
            router.push('/login')
            return true
        } catch (error) {
            setLoading(false)
            if (error instanceof z.ZodError) {
                showError('Invalid registration data')
            } else {
                showError((error as Error).message || 'Registration failed')
            }
            return false
        }
    }

    const logout = async () => {
        setLoggingOut(true)
        clearAlert()

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error.message || 'Logout failed')
            }

            setUser(null)
            await new Promise(resolve => setTimeout(resolve, 100))
            setLoggingOut(false)
            await router.push('/login')
            return true
        } catch (error) {
            setLoggingOut(false)
            showError((error as Error).message || 'Logout failed')
            return false
        }
    }

    const validateSession = async () => {
        setLoading(true)
        clearAlert()

        try {
            const response = await fetch('/api/auth/validate', {
                credentials: 'include'
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error.message || 'Session validation failed')
            }

            setUser(result.data.user)
            await new Promise(resolve => setTimeout(resolve, 100))
            setLoading(false)
            return true
        } catch (error) {
            setUser(null)
            setLoading(false)
            showWarning((error as Error).message || 'Session validation failed')
            return false
        }
    }

    return {
        user: user,
        isLoading: isLoading,
        isLoggingOut: isLoggingOut,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        login,
        register,
        logout,
        validateSession
    }
}