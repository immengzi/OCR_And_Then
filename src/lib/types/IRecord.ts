export interface IRecord {
    _id: string,
    userId: string,
    fileId: string,
    action: 'ocr' | 'answer' | 'summarize',
    result: string,
    timestamp: Date
}