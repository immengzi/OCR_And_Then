import mongoose from 'mongoose';

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI!).then(() => console.log('Connected to MongoDB'));

export const db = {
    User: userModel()
};

function userModel() {
    const schema = new Schema({
        email: { type: String, unique: true, required: true },
        username: { type: String, required: true },
        hash: { type: String, required: true },
        history: [
            {
                sourceType: { type: String, enum: ['pdf', 'image'], required: true },
                sourceContent: { type: String, required: true }, // 文件的存储路径或文件的ID（比如 GridFS ID）
                ocrResult: { type: String, required: true },
                thenOperation: { type: String, enum: ['summary', 'answer'], required: true },
                thenResult: { type: String, required: true },
                date: { type: Date, default: Date.now }
            }
        ]
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