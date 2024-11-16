import {Record} from '@/server/db/models';
import {ICreateRecord, IRecord} from "@/lib/types/IRecord";

export class RecordsRepository {
    async create(recordData: ICreateRecord): Promise<IRecord> {
        const record = new Record(recordData);
        return record.save();
    }

    async findAll(): Promise<IRecord[]> {
        return Record.find();
    }

    async findByUserId(userId: string): Promise<IRecord[]> {
        return Record.find({userId});
    }

    async findByFileId(fileId: string): Promise<IRecord | null> {
        return Record.findOne({fileId});
    }

    async findById(id: string): Promise<IRecord | null> {
        return Record.findById(id);
    }
}

export const recordsRepository = new RecordsRepository();