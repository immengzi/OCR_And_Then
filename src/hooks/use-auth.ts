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
    const showError = (message: string) => show(message, 'error')
    const searchParams = useSearchParams();

    const login = async (data: LoginData) => {
        clearAlert()
        try {
            setLoading(true)
            const validatedData = LoginSchema.parse(data)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Login failed')
            }

            setUser(result.data.user)
            showSuccess('Login successful')
            const returnUrl = searchParams.get('returnUrl') || '/';
            console.log('returnUrl', returnUrl);
            setTimeout(() => router.push(returnUrl), 1000);
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                showError('Invalid email or password format')
            } else {
                showError((error as Error).message || 'Login failed')
            }
            return false
        } finally {
            setLoading(false)
        }
    }

    const register = async (data: RegisterData) => {
        try {
            setLoading(true)
            const validatedData = RegisterSchema.parse(data)

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(validatedData)
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed')
            }

            showSuccess('Registration successful')
            setTimeout(() => router.push('/login'), 1000);
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                showError('Invalid registration data')
            } else {
                showError((error as Error).message || 'Registration failed')
            }
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            setLoggingOut(true)
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            })

            if (!response.ok) {
                throw new Error('Logout failed')
            }

            setUser(null)
            setTimeout(() => router.push('/login'), 1000);
        } catch (error) {
            showError((error as Error).message || 'Logout failed')
            throw error
        } finally {
            setLoggingOut(false)
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
        logout
    }
}