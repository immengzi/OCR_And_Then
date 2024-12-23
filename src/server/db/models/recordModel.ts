import mongoose, { Schema } from 'mongoose';
import {v4 as uuidv4} from "uuid";

const recordSchema = new Schema({
    _id: {type: String, default: () => uuidv4()},
    userId: { type: String, ref: 'User', required: true },
    action: { type: String, required: true },
    input: { type: String, required: true, trim: true },
    result: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now }
});

export const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);