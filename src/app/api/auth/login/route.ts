import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import {JwtHelper} from '@/server/middleware/jwt';
import {AppError} from "@/lib/types/errors";
import {usersRepository} from '@/server/repositories/users-repo';
import {LoginSchema} from '@/lib/config/auth';
import {withErrorHandler} from "@/server/middleware/api-utils";

export async function POST(request: NextRequest) {
    return withErrorHandler(async () => {
        const result = await LoginSchema.safeParseAsync(await request.json());
        if (!result.success) {
            throw AppError.BadRequest('Invalid request data', result.error.format());
        }

        const {email, password} = result.data;

        const existingUser = await usersRepository.findByEmail(email);
        if (!existingUser) {
            throw AppError.BadRequest('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.hash);
        if (!passwordMatch) {
            throw AppError.BadRequest('Invalid email or password');
        }

        const accessToken = await JwtHelper.generateAccessToken(existingUser);
        const refreshToken = await JwtHelper.generateRefreshToken(existingUser._id);

        const userData = {
            _id: existingUser._id,
            email: existingUser.email,
            username: existingUser.username
        };

        const response = NextResponse.json(userData);

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    });
}