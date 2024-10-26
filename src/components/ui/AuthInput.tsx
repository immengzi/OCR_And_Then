import {LucideIcon} from 'lucide-react'

interface AuthInputProps {
    label: string
    field: any
    type: string
    placeholder: string
    error?: any
    icon: LucideIcon
}

export function AuthInput({label, field, type, placeholder, error, icon: Icon}: AuthInputProps) {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <label className="input input-bordered flex items-center gap-2">
                <Icon className="h-4 w-4"/>
                <input
                    {...field}
                    type={type}
                    className={`grow ${error ? 'is-invalid' : ''}`}
                    placeholder={placeholder}
                />
            </label>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message?.toString()}</span>
                </label>
            )}
        </div>
    )
}