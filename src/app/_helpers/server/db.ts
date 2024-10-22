import mongoose from 'mongoose';

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI!).then(() => console.log('Connected to MongoDB'));

export const db = {
    User: userModel(),
    File: fileModel(),
    Record: recordModel()
};

function userModel() {
    const schema = new Schema({
        email: {type: String, unique: true, required: true},
        username: {type: String, required: true},
        hash: {type: String, required: true},
        role: {type: String, enum: ['User', 'Admin'], required: true}
    }, {
        // add createdAt and updatedAt timestamps
        timestamps: true
    });

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.hash;
        }
    });

    return mongoose.models.User || mongoose.model('User', schema);
}

function fileModel() {
    const schema = new Schema({
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        filename: { type: String, required: true },
        contentType: {type: String, enum: ['image/jpeg', 'application/pdf'], required: true},
        size: { type: Number, required: true },
        md5: { type: String, required: true }, // 文件校验和
        metadata: { type: Object }, // 可选的附加元数据
        uploadDate: { type: Date, default: Date.now }
    });

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false
    });

    return mongoose.models.File || mongoose.model('File', schema);
}

function recordModel() {
    const schema = new Schema({
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        source: { type: Schema.Types.ObjectId, ref: 'File', required: true },
        action: { type: String, enum: ['ocr', 'answer'], required: true },
        result: { type: String, required: true, trim: true },
        timestamp: { type: Date, default: Date.now }
    });

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false
    });

    return mongoose.models.Record || mongoose.model('Record', schema);
}