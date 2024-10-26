'use client'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {useAuth} from "@/hooks/use-auth"
import {AUTH_CONFIG} from '@/lib/config/auth'
import {AuthInput} from '@/components/ui/AuthInput'
import {Key, Mail, User} from 'lucide-react'
import {RegisterData} from '@/lib/types'

export default function Register() {
    const {register: registerUser} = useAuth()
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm()

    const onSubmit = async (data: RegisterData) => {
        await registerUser(data)
    }

    return (
        <>
            <h2 className="text-3xl font-bold">Register</h2>
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
                    label="Username"
                    field={register('username', AUTH_CONFIG.validation.username)}
                    type="text"
                    placeholder="Enter username"
                    error={errors.username}
                    icon={User}
                />

                <AuthInput
                    label="Password"
                    field={register('password', AUTH_CONFIG.validation.password)}
                    type="password"
                    placeholder="Enter password"
                    error={errors.password}
                    icon={Key}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                >
                    {isSubmitting && (
                        <span className="loading loading-infinity loading-sm"/>
                    )}
                    Register
                </button>
            </form>

            <div className="divider">OR</div>

            <div className="text-center">
                <p>Already have an account?</p>
                <Link
                    href={AUTH_CONFIG.links.login.href}
                    className="link link-primary"
                >
                    Login now
                </Link>
            </div>
        </>
    )
}