export interface IFile {
    _id: string;
    userId: string;
    name: string;
    size: number;
    type: string;
    path: string;
    lastModified: Date;
    uploadedAt: Date;
}

export interface IUploadFile {
    userId: string;
    name: string;
    size: number;
    type: string;
    path: string;
    lastModified: Date;
}