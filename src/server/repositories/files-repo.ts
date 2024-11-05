import {File} from '@/server/db/models'
import {IFile} from "@/lib/types/IFile";

export class FilesRepository {
    async create(fileData: IFile): Promise<IFile> {
        const file = new File(fileData);
        return file.save();
    }

    async findAll(): Promise<IFile[]> {
        return File.find();
    }

    async findByUserId(userId: string): Promise<IFile | null> {
        return File.findOne({userId})
    }

    async findById(id: string): Promise<IFile | null> {
        return File.findById(id)
    }
}

export const filesRepository = new FilesRepository()