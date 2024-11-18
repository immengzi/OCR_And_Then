'use client';

import React, {useState} from 'react';
import {IRecord} from "@/lib/types/IRecord";
import {useQuery} from '@tanstack/react-query';
import {useHistory} from "@/hooks/use-history";
import {AlertCircle, Bot, Clock, FileText, MessageSquare, Send} from 'lucide-react';

const History = () => {
    const {getHistory} = useHistory();
    const [selectedRecord, setSelectedRecord] = useState<IRecord | null>(null);

    const {data: historyRecords = [], isError} = useQuery({
        queryKey: ['history'],
        queryFn: getHistory
    });

    const handleRecordClick = (record: IRecord) => {
        setSelectedRecord(record);
    };

    const formatTimestamp = (timestamp: Date) => {
        return new Date(timestamp).toLocaleString();
    };

    const renderInput = (input: string) => {
        if (input.startsWith('http')) {
            return (
                <div className="break-all whitespace-pre-wrap max-w-full overflow-hidden">
                    <a
                        href={input}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        {input}
                    </a>
                </div>
            );
        }
        return <p className="break-all whitespace-pre-wrap max-w-full overflow-hidden">{input}</p>;
    };

    return (
        <div className="drawer lg:drawer-open bg-base-100">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>

            <div className="drawer-content flex flex-col p-4">
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4">
                    Choose a record
                </label>

                {historyRecords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-base-content/60">
                        <FileText size={48} className="mb-2"/>
                        <p>No history records found</p>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl mx-auto">
                        {selectedRecord ? (
                            <div className="space-y-4">
                                <div className="bg-base-200 rounded-lg shadow p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">{selectedRecord.action}</h2>
                                        <span className="text-sm text-base-content/60">
                                            {formatTimestamp(selectedRecord.timestamp)}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-base-300 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="text-primary" size={20}/>
                                                <h3 className="font-medium">User Input</h3>
                                            </div>
                                            {renderInput(selectedRecord.input)}
                                        </div>

                                        <div className="bg-base-300 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Bot className="text-secondary" size={20}/>
                                                <h3 className="font-medium">Assistant Response</h3>
                                            </div>
                                            <p className="text-base-content whitespace-pre-wrap">{selectedRecord.result}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-base-content/60">
                                <Send size={48} className="mb-2"/>
                                <p>Select a conversation from the sidebar to view details</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="bg-base-100 border-r border-base-300 w-80 min-h-full p-4">
                    <div className="flex items-center gap-2 mb-4 pl-2">
                        <Clock className="text-base-content/70"/>
                        <h2 className="text-lg font-semibold">History Records</h2>
                    </div>

                    {isError ? (
                        <div className="flex items-center gap-2 text-red-500 p-4">
                            <AlertCircle size={20}/>
                            <p>Failed to load history</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {historyRecords.map((record: IRecord) => (
                                <li key={record._id}>
                                    <button
                                        onClick={() => handleRecordClick(record)}
                                        className={`w-full p-3 text-left rounded-lg transition-colors duration-200 
                ${selectedRecord?._id === record._id
                                            ? 'bg-primary/10 border border-primary/30'
                                            : 'hover:bg-base-200'}`}
                                    >
                                        <div className="font-medium text-base-content flex items-baseline gap-1">
                                            <span className="font-bold whitespace-nowrap">{record.action}: </span>
                                            <span className="truncate">{record.input}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatTimestamp(record.timestamp)}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;