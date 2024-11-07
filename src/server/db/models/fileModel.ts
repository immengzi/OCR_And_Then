import mongoose, { Schema } from 'mongoose';
import {v4 as uuidv4} from "uuid";

const fileSchema = new Schema({
    _id: {type: String, default: () => uuidv4()},
    userId: { type: String, ref: 'User', required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: {type: String, required: true},
    path: { type: String, required: true },
    lastModified: { type: Date, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

export const File = mongoose.models.File || mongoose.model('File', fileSchema);