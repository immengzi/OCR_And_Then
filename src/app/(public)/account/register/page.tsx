'use client';

import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {useUserService} from "@/app/_services";
import InputField from "@/app/_components/Input";

const loginLink = {label: "Login", href: "/account/login"};

export default Register;

function Register() {
    const userService = useUserService();

    // get functions to build form with useForm() hook
    const {register, handleSubmit, formState} = useForm();
    const {errors} = formState;

    const fields = {
        email: register('email', {required: 'Email is required'}),
        username: register('username', {required: 'Username is required'}),
        password: register('password', {
            required: 'Password is required',
            minLength: {value: 6, message: 'Password must be at least 6 characters'}
        })
    }

    async function onSubmit(user: any) {
        await userService.register(user);
    }

    return (
        <>
            <h2 className="text-3xl font-bold">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path
                                d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                        </svg>
                        <InputField
                            field={fields.email}
                            type="email"
                            placeholder="email@example.com"
                            error={errors.email}
                        />
                        <div className="invalid-feedback">{errors.email?.message?.toString()}</div>
                    </label>
                </div>
                <div className="form-control mt-4">
                    <label className="label">
                        <span className="label-text">UserName</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-person-vcard-fill" viewBox="0 0 16 16">
                            <path
                                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5M9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8m1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5m-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96q.04-.245.04-.5M7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
                        </svg>
                        <InputField
                            field={fields.username}
                            type="text"
                            placeholder="Enter username"
                            error={errors.username}
                        />
                        <div className="invalid-feedback">{errors.username?.message?.toString()}</div>
                    </label>
                </div>
                <div className="form-control mt-4">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-key-fill" viewBox="0 0 16 16">
                            <path
                                d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        <input {...fields.password} type="password"
                               className={`grow form-control ${errors.password ? 'is-invalid' : ''}`}
                               placeholder="Enter password"/>
                        <div className="invalid-feedback">{errors.password?.message?.toString()}</div>
                    </label>
                </div>
                <div className="form-control mt-6">
                    <button disabled={formState.isSubmitting} className="btn btn-primary">
                        {formState.isSubmitting && <span className="loading loading-infinity loading-sm me-1"></span>}
                        Register
                    </button>
                </div>
            </form>
            <div className="divider">OR</div>
            <div className="text-center">
                <p>Already have an account?</p>
                <Link href={loginLink.href} className={"link link-primary"}>
                    Login in now
                </Link>
            </div>
        </>
    );
}