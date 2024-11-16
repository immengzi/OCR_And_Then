'use client';

import {ChangeEvent} from 'react';
import {usePlayStore} from "@/store/slices/play-slice";
import {useLoadingStore} from "@/store/slices/loading-slice";
import {Copy, Download, Eraser, PencilLine, RotateCcw, StickyNote, Upload} from 'lucide-react';
import {usePlay} from "@/hooks/use-play";
import {useAlert} from "@/hooks/use-alert";

export default function Play() {
    const {ocr, answer, summary} = usePlay();
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

    const handleAnswer = async () => {
        if (!input.trim()) {
            showWarning('Please input content first');
            return;
        }

        await answer(input);
    };

    const handleSummary = async () => {
        if (!input.trim()) {
            showWarning('Please input content first');
            return;
        }

        showLoading('Generating summary...');
        const _summary = await summary(input);
        if (_summary) {
            setResult(_summary);
            updateCache('summary', _summary);
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
                    <div className="tooltip" data-tip="Answer question">
                        <button onClick={handleAnswer} className="btn btn-ghost btn-sm">
                            <PencilLine/>
                        </button>
                    </div>
                    <div className="tooltip" data-tip="Generate summary">
                        <button onClick={handleSummary} className="btn btn-ghost btn-sm">
                            <StickyNote/>
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
                rows={30}
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

