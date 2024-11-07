'use client';

import {ChangeEvent, useState} from 'react';
import {usePlay} from "@/hooks/use-play";
import {useAlert} from '@/hooks/use-alert';

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
}

const FormField = ({label, children}: FormFieldProps) => (
    <div className="flex items-center flex-col gap-3">
        <h2 className="text-lg font-medium">{label}</h2>
        {children}
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
        <div className="max-w-sm w-full">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <FormField label="GPT API MODEL">
                    <select
                        className="select select-primary w-full"
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

                <FormField label="Target Testpaper">
                    <input
                        type="file"
                        accept={ACCEPTED_FILE_TYPES}
                        capture="environment"
                        className="file-input file-input-bordered file-input-primary w-full"
                        required
                        onChange={handleFileChange}
                    />
                </FormField>

                <div className="flex items-center flex-col">
                    <button
                        className="btn btn-primary w-full max-w-40"
                        type="submit"
                    >
                        Start OCR
                    </button>
                </div>
            </form>
        </div>
    );
}