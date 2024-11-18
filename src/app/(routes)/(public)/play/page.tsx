'use client';

import {ChangeEvent} from 'react';
import {usePlayStore} from "@/store/slices/play-slice";
import {useLoadingStore} from "@/store/slices/loading-slice";
import {Book, Copy, Download, Eraser, MessageCircle, RotateCcw, SquarePen, Upload} from 'lucide-react';
import {usePlay} from "@/hooks/use-play";
import {useAlert} from "@/hooks/use-alert";

export default function Play() {
    const {ocr, chat} = usePlay();
    const {showWarning} = useAlert();
    const {showLoading, hideLoading} = useLoadingStore();
    const {
        input,
        result,
        setInput,
        setResult,
        updateCache,
        resetAll
    } = usePlayStore();

    const ACCEPTED_FILE_TYPES = process.env.UPLOAD_ALLOWED_TYPES || 'application/pdf';
    const ACCEPTED_FILE_MAX_SIZE = Number(process.env.UPLOAD_MAX_SIZE || 6 * 1024 * 1024);

    const handleOcr = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > ACCEPTED_FILE_MAX_SIZE) {
            showWarning(`File size should not exceed ${ACCEPTED_FILE_MAX_SIZE / 1024 / 1024} MB`);
            e.target.value = '';
            return;
        }

        await ocr(file);
        e.target.value = '';
    };

    const handleClear = () => {
        setInput('');
        setResult('');
    };

    const handleChat = async (prompt_type: string) => {
        if (!input.trim()) {
            showWarning('Please input content first');
            return;
        }
        showLoading('Answering question...');
        const _result = await chat(prompt_type, input);
        if (_result) {
            setResult(_result);
            updateCache('prompt_type', _result);
        }
        hideLoading();
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const handleDownload = (content: string, filename: string) => {
        const blob = new Blob([content], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        resetAll();
    };

    return (
        <div className="p-2 space-y-2 max-w-full overflow-x-hidden">
            <textarea
                className="w-full bg-base-200 p-2 rounded"
                rows={10}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your content or upload a file..."
            />
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="tooltip tooltip-right" data-tip="Upload file and OCR">
                        <label className="btn btn-ghost btn-sm">
                            <Upload/>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleOcr}
                                accept={ACCEPTED_FILE_TYPES}
                            />
                        </label>
                    </div>
                    <div className="tooltip" data-tip="Clear content">
                        <button onClick={handleClear} className="btn btn-ghost btn-sm">
                            <Eraser/>
                        </button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="tooltip" data-tip="Recognize e-books">
                        <button onClick={() => handleChat('ebook')} className="btn btn-ghost btn-sm">
                            <Book/>
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Do the test questions">
                        <button onClick={() => handleChat('test_paper')} className="btn btn-ghost btn-sm">
                            <SquarePen/>
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Custom chat">
                        <button onClick={() => handleChat('default')} className="btn btn-ghost btn-sm">
                            <MessageCircle/>
                        </button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="tooltip" data-tip="Copy content">
                        <button
                            onClick={() => handleCopy(input)}
                            className="btn btn-ghost btn-sm"
                        >
                            <Copy/>
                        </button>
                    </div>
                    <div className="tooltip tooltip-left" data-tip="Download content">
                        <button
                            onClick={() => handleDownload(input, 'input.txt')}
                            className="btn btn-ghost btn-sm"
                        >
                            <Download/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="divider"/>
            <textarea
                className="w-full bg-base-200 p-2 rounded"
                rows={18}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Result will appear here..."
            />
            <div className="flex justify-between items-center">
                <div/>
                <div className="flex gap-4">
                    <div className="tooltip" data-tip="Reset all">
                        <button onClick={handleReset} className="btn btn-ghost btn-sm">
                            <RotateCcw/>
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Copy result">
                        <button
                            onClick={() => handleCopy(result)}
                            className="btn btn-ghost btn-sm"
                        >
                            <Copy/>
                        </button>
                    </div>
                    <div className="tooltip tooltip-left" data-tip="Download result">
                        <button
                            onClick={() => handleDownload(result, 'result.txt')}
                            className="btn btn-ghost btn-sm"
                        >
                            <Download/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

