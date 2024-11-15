export interface IRecord {
    _id: string,
    userId: string,
    fileId: string,
    action: 'ocr' | 'answer' | 'summary',
    result: string,
    timestamp: Date
}

export interface ICreateRecord {
    userId: string,
    fileId: string,
    action: 'ocr' | 'answer' | 'summary',
    result: string
}