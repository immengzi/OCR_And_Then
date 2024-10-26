import {z} from 'zod'

export const AUTH_CONFIG = {
    links: {
        register: {label: "Register", href: "/register"},
        login: {label: "Login", href: "/login"},
        forgetpwd: {label: "Forgot Password", href: "/forgetpwd"}
    },
    validation: {
        email: {
            required: 'Email is required',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
            }
        },
        username: {
            required: 'Username is required',
            minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
            }
        },
        password: {
            required: 'Password is required',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
            }
        }
    }
} as const

export const RegisterSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    username: z.string()
        .min(1, 'Username must be at least 1 characters')
        .max(50, 'Username must be less than 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
})

export const LoginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters')
})