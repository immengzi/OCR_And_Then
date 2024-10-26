import mongoose, { Schema } from 'mongoose';
import {v4 as uuidv4} from "uuid";

const fileSchema = new Schema({
    _id: {type: String, default: () => uuidv4()},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    contentType: {type: String, enum: ['image/jpeg', 'application/pdf'], required: true},
    size: { type: Number, required: true },
    md5: { type: String, required: true },
    metadata: { type: Object },
    uploadDate: { type: Date, default: Date.now }
});

fileSchema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

export const File = mongoose.models.File || mongoose.model('File', fileSchema);