import mongoose from 'mongoose';

declare global {
    let mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// 在全局对象上初始化mongoose属性
if (!global.mongoose) {
    global.mongoose = {
        conn: null,
        promise: null
    };
}

const MONGODB_URI = process.env.MONGODB_URI!;

const MAX_POOL_SIZE = 10;

async function dbConnect() {
    // 如果已经存在连接，直接返回
    if (global.mongoose.conn) {
        console.log('Using existing connection');
        return global.mongoose.conn;
    }

    // 如果正在建立连接，返回promise
    if (global.mongoose.promise) {
        console.log('Using existing connection promise');
        return global.mongoose.promise;
    }

    // 创建新连接
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
        maxPoolSize: MAX_POOL_SIZE,
        minPoolSize: 5,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    });

    try {
        global.mongoose.conn = await global.mongoose.promise;

        // 监听连接事件
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
            console.log('MongoDB connection error:', err);
            global.mongoose.conn = null;
            global.mongoose.promise = null;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            global.mongoose.conn = null;
            global.mongoose.promise = null;
        });

        // 处理进程退出
        const cleanup = async () => {
            try {
                await mongoose.connection.close();
                global.mongoose.conn = null;
                global.mongoose.promise = null;
                process.exit(0);
            } catch (err) {
                console.error('Error during cleanup:', err);
                process.exit(1);
            }
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

        console.log('New database connection established');
        return global.mongoose.conn;

    } catch (error) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// 导出清理函数供外部使用
export const closeConnection = async () => {
    if (global.mongoose.conn) {
        await mongoose.connection.close();
        global.mongoose.conn = null;
        global.mongoose.promise = null;
    }
};

export default dbConnect;