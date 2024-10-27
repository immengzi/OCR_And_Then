import dbConnect from "@/server/db/config/connection";

export async function init() {
    try {
        await dbConnect();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        // 生产环境出错直接退出应用
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}