import {Bot, FileInput} from 'lucide-react';
import {ChangeEvent} from 'react';

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

const ACCEPTED_FILE_TYPES = process.env.UPLOAD_ALLOWED_TYPES || 'image/*, application/pdf';
const MAX_FILE_SIZE = process.env.UPLOAD_MAX_SIZE || 10 * 1024 * 1024;

interface UploadSectionProps {
    formData: FormData;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
    onModelChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const UploadSection = ({
                                  formData,
                                  onFileChange,
                                  onModelChange,
                                  onSubmit
                              }: UploadSectionProps) => {
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-center">
                Upload Testpaper & Play with GPT
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary"/>
                        <h3 className="font-medium">Select GPT Model</h3>
                    </div>
                    <select
                        value={formData.model}
                        onChange={onModelChange}
                        className="w-full p-2 border border-neutral-content bg-base-100 rounded-md"
                    >
                        {GPT_MODELS.map(model => (
                            <option key={model.value} value={model.value}>
                                {model.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FileInput className="w-4 h-4 text-primary"/>
                        <h3 className="font-medium">Upload Test Paper</h3>
                    </div>
                    <div className="border border-neutral-content border-dashed rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept={ACCEPTED_FILE_TYPES}
                            capture="environment"
                            required
                            onChange={onFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer space-y-2 block"
                        >
                            <FileInput className="w-12 h-12 mx-auto text-primary"/>
                            <p className="text-sm text-gray-600">
                                Upload PDF or Image files {Number(MAX_FILE_SIZE) / 1024 / 1024} MB
                            </p>
                            {formData.file && (
                                <p className="text-sm text-primary font-medium">
                                    Selected: {formData.file.name}
                                </p>
                            )}
                        </label>
                    </div>
                </div>

                <button
                    className="btn btn-primary w-full"
                    type="submit"
                >
                    Start Playing
                </button>
            </form>
        </div>
    );
};