'use client';

import {useAuth} from "@/hooks/use-auth";
import {useAlert} from "@/hooks/use-alert";
import {Loader2, Lock, Mail, Save, User, X} from 'lucide-react';
import React, {useState} from 'react';

// Define all types at the top
type FieldType = 'username' | 'password';

interface EditingState {
    username: boolean;
    password: boolean;
}

interface FormData {
    username: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface LoadingState {
    username: boolean;
    password: boolean;
}

interface FieldConfig {
    icon: JSX.Element;
    label: string;
    value: string;
    isPassword?: boolean;
}

export default function Profile() {
    // Hooks
    const {user, updateUsername, updatePassword} = useAuth();
    const {showSuccess, showError} = useAlert();

    // State
    const [isEditing, setIsEditing] = useState<EditingState>({
        username: false,
        password: false
    });

    const [formData, setFormData] = useState<FormData>({
        username: user?.username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState<LoadingState>({
        username: false,
        password: false
    });

    // Field configurations
    const fieldConfigs: Record<FieldType, FieldConfig> = {
        username: {
            icon: <User size={20}/>,
            label: 'Username',
            value: user?.username || ''
        },
        password: {
            icon: <Lock size={20}/>,
            label: 'Password',
            value: '••••••••',
            isPassword: true
        }
    };

    type FormDataKey<T extends FieldType> = T extends 'password' ? 'newPassword' : T;

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePassword = (): boolean => {
        if (formData.newPassword.length < 6) {
            showError("Password must be at least 6 characters long");
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            showError("Passwords do not match");
            return false;
        }
        return true;
    };

    const resetField = (field: FieldType) => {
        setIsEditing(prev => ({...prev, [field]: false}));
        if (field === 'password') {
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
        }
    };

    const handleSubmit = async (field: FieldType) => {
        if (!user?._id) return;

        setLoading(prev => ({...prev, [field]: true}));

        try {
            if (field === 'password') {
                if (!validatePassword()) {
                    setLoading(prev => ({...prev, [field]: false}));
                    return;
                }
                await updatePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                });
            } else {
                await updateUsername(formData.username);
            }

            showSuccess(`${fieldConfigs[field].label} updated successfully!`);
            resetField(field);
        } catch (error) {
            showError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(prev => ({...prev, [field]: false}));
        }
    };

    const renderEditableField = (field: FieldType) => {
        const config = fieldConfigs[field];
        const isPasswordField = config.isPassword;

        return (
            <div className="card bg-base-100 shadow-xl mb-4">
                <div className="card-body">
                    <h3 className="card-title flex items-center gap-2">
                        {config.icon}
                        {config.label}
                    </h3>

                    {!isEditing[field] ? (
                        <div className="flex justify-between items-center">
                            <p className="text-lg">{config.value}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(prev => ({...prev, [field]: true}))}
                            >
                                Edit
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {isPasswordField && (
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    placeholder="Current password"
                                    required
                                />
                            )}
                            <input
                                type={isPasswordField ? "password" : "text"}
                                name={isPasswordField ? "newPassword" : field}
                                value={isPasswordField ? formData.newPassword : formData[field as FormDataKey<typeof field>]}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                placeholder={`${isPasswordField ? "New" : ""} ${config.label}`}
                                required
                            />
                            {isPasswordField && (
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    placeholder="Confirm new password"
                                    required
                                />
                            )}
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-primary flex-1"
                                    onClick={() => handleSubmit(field)}
                                    disabled={loading[field]}
                                >
                                    {loading[field] ? (
                                        <Loader2 className="animate-spin" size={20}/>
                                    ) : (
                                        <Save size={20}/>
                                    )}
                                    Save
                                </button>
                                <button
                                    className="btn btn-ghost flex-1"
                                    onClick={() => resetField(field)}
                                    disabled={loading[field]}
                                >
                                    <X size={20}/> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderEmailField = () => (
        <div className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <h3 className="card-title flex items-center gap-2">
                    <Mail size={20}/>
                    Email
                    <span className="badge badge-neutral text-xs">Readonly</span>
                </h3>
                <div className="flex items-center">
                    <p className="text-lg break-all">{user?.email}</p>
                </div>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="container mx-auto max-w-2xl p-4 mt-12">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            {renderEmailField()}
            {renderEditableField('username')}
            {renderEditableField('password')}
        </div>
    );
}