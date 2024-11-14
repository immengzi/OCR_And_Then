'use client';

import {ChangeEvent, useState} from 'react';
import {OcrFormData} from "@/lib/types";
import {usePlayStore} from "@/store/slices/play-slice";
import {usePlay} from "@/hooks/use-play";
import {useAlert} from "@/hooks/use-alert";
import {UploadSection} from '@/components/play/upload-section';
import {TabSection} from '@/components/play/tab-section';

export default function Play() {
    const {upload, ocr} = usePlay();
    const {showWarning} = useAlert();
    const {displayMode} = usePlayStore();

    const [formData, setFormData] = useState<OcrFormData>({
        model: 'gpt-4o-mini',
        file: null
    });

    const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({...prev, model: e.target.value}));
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showWarning('File size should not exceed 10MB');
            e.target.value = '';
            return;
        }

        const success = await upload(file);
        if (success) {
            setFormData(prev => ({...prev, file}));
        } else {
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.file) return;

        await ocr(formData);
    };

    return (
        <>
            {displayMode === 'upload' ? (
                <UploadSection
                    formData={formData}
                    onFileChange={handleFileChange}
                    onModelChange={handleModelChange}
                    onSubmit={handleSubmit}
                />
            ) : (
                <TabSection/>
            )}
        </>
    );
}

