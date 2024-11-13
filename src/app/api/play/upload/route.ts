import {NextRequest, NextResponse} from "next/server";
import {PutObjectCommand, S3Client, S3ClientConfig} from "@aws-sdk/client-s3";
import {IUploadFile} from "@/lib/types/IFile";
import {AppError} from "@/lib/types/errors";
import {filesRepository} from "@/server/repositories/files-repo";
import {mkdir, writeFile} from 'fs/promises';
import {join} from 'path';
import {existsSync} from 'fs';
import {withErrorHandler} from "@/server/middleware/api-utils";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local';
const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

const config: S3ClientConfig = {
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    }
};

const s3Client = new S3Client(config);

async function saveLocally(file: File, fileName: string) {
    const uploadDir = join(process.cwd(), UPLOADS_DIR);

    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, {recursive: true});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);
    return path;
}

async function saveToR2(file: File, fileName: string) {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const params = {
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream'
        };
        await s3Client.send(new PutObjectCommand(params));

        const baseUrl = R2_PUBLIC_URL
            ? (R2_PUBLIC_URL.endsWith('/') ? R2_PUBLIC_URL.slice(0, -1) : R2_PUBLIC_URL)
            : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

        return `${baseUrl}/${fileName}`;
    } catch {
        throw AppError.ServerError('Failed to upload file to R2');
    }
}

export async function POST(request: NextRequest) {
    return withErrorHandler(async () => {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;

        if (!file) {
            throw AppError.BadRequest('No file found');
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw AppError.BadRequest('File size too large');
        }

        const fileName = `${userId}-${Date.now()}-${file.name}`;
        let filePath: string;

        if (STORAGE_PROVIDER === 'local') {
            filePath = await saveLocally(file, fileName);
        } else {
            filePath = await saveToR2(file, fileName);
        }

        const fileData: IUploadFile = {
            userId: userId,
            name: file.name,
            size: file.size,
            type: file.type,
            path: filePath,
            lastModified: new Date(file.lastModified)
        };

        const iFile = await filesRepository.create(fileData);

        return NextResponse.json({
            message: 'File uploaded successfully',
            file: {
                fileName: iFile.name,
                uploadedAt: iFile.uploadedAt
            }
        });
    });
}