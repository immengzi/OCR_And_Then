import mongoose, { Schema } from 'mongoose';
import {v4 as uuidv4} from "uuid";

const recordSchema = new Schema({
    _id: {type: String, default: () => uuidv4()},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: Schema.Types.ObjectId, ref: 'File', required: true },
    action: { type: String, enum: ['ocr', 'answer'], required: true },
    result: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now }
});

recordSchema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

export const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);