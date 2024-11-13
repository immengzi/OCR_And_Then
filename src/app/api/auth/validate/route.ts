import {NextResponse} from "next/server";
import {AppError} from "@/lib/types/errors";
import {JwtHelper} from '@/server/middleware/jwt';
import {usersRepository} from '@/server/repositories/users-repo';
import {cookies} from 'next/headers';
import {withErrorHandler} from "@/server/middleware/api-utils";

async function validateSession() {
    const cookieStore = cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) {
        throw AppError.Unauthorized();
    }

    try {
        const decodedToken = await JwtHelper.verifyToken(accessToken);
        const user = await usersRepository.findById(decodedToken._id);

        if (!user) {
            throw AppError.NotFound('User not found');
        }

        return NextResponse.json({
            _id: user._id,
            email: user.email,
            username: user.username
        });

    } catch {
        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (!refreshToken) {
            throw AppError.Unauthorized('Refresh token not found');
        }

        const decodedRefreshToken = await JwtHelper.verifyToken(refreshToken);
        const user = await usersRepository.findById(decodedRefreshToken._id);

        if (!user) {
            throw AppError.NotFound('User not found');
        }

        const newAccessToken = await JwtHelper.generateAccessToken(user);

        const response = NextResponse.json({
            _id: user._id,
            username: user.username
        });

        response.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    }
}

export async function GET() {
    return withErrorHandler(async () => {
        try {
            return await validateSession();
        } catch (error) {
            const response = NextResponse.json(
                { message: 'Session invalidated' },
                { status: error instanceof AppError ? error.statusCode : 500 }
            );

            response.cookies.set('accessToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 0
            });

            response.cookies.set('refreshToken', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 0
            });

            throw error; // 继续抛出错误，让 withErrorHandler 处理
        }
    });
}