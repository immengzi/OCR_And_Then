export interface IFile {
    _id: string,
    userId: string,
    filename: string,
    contentType: 'image/jpeg' | 'application/pdf',
    size: number,
    md5: string,
    metadata: object,
    timestamp: Date
}