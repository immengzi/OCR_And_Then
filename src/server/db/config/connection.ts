import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const MAX_POOL_SIZE = 10; // 根据需求调整

interface ConnectionPool {
    isConnected?: number;
}

const connectionPool: ConnectionPool = {};

async function dbConnect() {
    // 如果已经连接，直接返回
    if (connectionPool.isConnected) {
        console.log('Using existing connection');
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI, {
            maxPoolSize: MAX_POOL_SIZE,
            minPoolSize: 5, // 保持最小连接数
            connectTimeoutMS: 10000, // 连接超时时间
            socketTimeoutMS: 45000, // Socket 超时时间
        });

        connectionPool.isConnected = db.connections?.[0].readyState;
        console.log('New database connection established');

        // 监听连接事件
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        });

        mongoose.connection.on('error', (err) => {
            console.log('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            // 可以在这里添加重连逻辑
        });

        // 优雅关闭连接
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export default dbConnect;