'use client';

import {ChangeEvent, useState} from 'react';
import {Bot, FileInput, Upload} from 'lucide-react';
import {usePlay} from "@/hooks/use-play";
import {useAlert} from "@/hooks/use-alert";

interface FormData {
    model: string;
    file: File | null;
}

const GPT_MODELS = [
    {value: 'gpt-4o-mini', label: 'GPT-4o-Mini'},
    {value: 'gpt-4o', label: 'GPT-4o'},
    {value: 'gpt-4-turbo', label: 'GPT-4-Turbo'},
    {value: 'gpt-4', label: 'GPT-4'},
    {value: 'gpt-3.5-turbo', label: 'GPT-3.5-Turbo'}
] as const;

const ACCEPTED_FILE_TYPES = 'application/pdf, image/*';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const FormField = ({label, children, icon}: FormFieldProps) => (
    <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
            {icon && <span className="text-base-content/70">{icon}</span>}
            <h2 className="text-base font-medium text-base-content">{label}</h2>
        </div>
        <div className="w-full">
            {children}
        </div>
    </div>
);

export default function Play() {
    const {upload, ocr} = usePlay();
    const {show} = useAlert();
    const showError = (message: string) => show(message, 'error');

    const [formData, setFormData] = useState<FormData>({
        model: 'gpt-4o-mini',
        file: null
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // TODO: 实现表单提交逻辑
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showError(`File size should not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`);
            e.target.value = '';
            return;
        }

        setFormData(prev => ({...prev, file}));

        const success = await upload(file);

        if (!success) {
            e.target.value = '';
            setFormData(prev => ({...prev, file: null}));
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6">
            <div className="bg-base-100 rounded-lg shadow-xl">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-base-content mb-6">
                        Upload Testpaper & Play with GPT
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <FormField
                            label="Select GPT Model"
                            icon={<Bot className="w-4 h-4"/>}
                        >
                            <select
                                className="select select-bordered w-full bg-base-100"
                                value={formData.model}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setFormData(prev => ({...prev, model: e.target.value}))
                                }
                            >
                                {GPT_MODELS.map(model => (
                                    <option key={model.value} value={model.value}>
                                        {model.label}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField
                            label="Upload Test Paper"
                            icon={<FileInput className="w-4 h-4"/>}
                        >
                            <div
                                className="flex flex-col items-center p-6 border border-base-content/10 rounded-lg bg-base-100 hover:border-base-content/15 transition-colors">
                                <Upload className="w-8 h-8 text-base-content/50 mb-2"/>
                                <p className="text-sm text-base-content/50 mb-4">
                                    Upload PDF or Image files (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
                                </p>
                                <input
                                    type="file"
                                    accept={ACCEPTED_FILE_TYPES}
                                    capture="environment"
                                    className="file-input file-input-bordered w-full"
                                    required
                                    onChange={handleFileChange}
                                />
                            </div>
                        </FormField>

                        <div className="flex items-center flex-col">
                            <button
                                className="btn btn-primary w-full"
                                type="submit"
                            >
                                Start Playing
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}