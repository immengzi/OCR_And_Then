'use client'

import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useAuth} from "@/hooks/use-auth"
import {AUTH_CONFIG} from '@/lib/config/auth'
import {AuthInput} from '@/components/ui/AuthInput'
import {Key, Mail} from 'lucide-react'
import {LoginData} from '@/lib/types'

export default function Login() {
    const {login} = useAuth()
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm()

    const onSubmit = async (data: LoginData) => {
        await login(data)
    }

    return (
        <>
            <h2 className="text-3xl font-bold">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AuthInput
                    label="Email"
                    field={register('email', AUTH_CONFIG.validation.email)}
                    type="email"
                    placeholder="email@example.com"
                    error={errors.email}
                    icon={Mail}
                />

                <AuthInput
                    label="Password"
                    field={register('password', AUTH_CONFIG.validation.password)}
                    type="password"
                    placeholder="Enter password"
                    error={errors.password}
                    icon={Key}
                />

                <div className="text-sm text-right">
                    <Link
                        href={AUTH_CONFIG.links.forgetpwd.href}
                        className="link link-hover text-primary"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                >
                    {isSubmitting && (
                        <span className="loading loading-infinity loading-sm"/>
                    )}
                    Login
                </button>
            </form>

            <div className="divider">OR</div>

            <div className="text-center">
                <p>{"Don't have an account?"}</p>
                <Link
                    href={AUTH_CONFIG.links.register.href}
                    className="link link-primary"
                >
                    Sign up now
                </Link>
            </div>
        </>
    )
}