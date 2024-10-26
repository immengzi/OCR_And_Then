import dbConnect from '@/server/db/config/connection';

// 在应用启动时初始化数据库连接
export async function init() {
    try {
        await dbConnect();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        // 可以根据需要决定是否要中断应用启动
        process.exit(1);
    }
}