import {NextRequest, NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import {AppError} from "@/lib/types/errors";
import {usersRepository} from '@/server/repositories/users-repo';
import {RegisterSchema} from "@/lib/config/auth";
import {withErrorHandler} from "@/server/middleware/api-utils";

export async function POST(request: NextRequest) {
    return withErrorHandler(async () => {
        const result = await RegisterSchema.safeParseAsync(await request.json());
        if (!result.success) {
            throw AppError.BadRequest('Invalid request data', result.error.format());
        }

        const {email, username, password} = result.data;

        const existingUser = await usersRepository.findByEmail(email);
        if (existingUser) {
            throw AppError.BadRequest('Email already in use');
        }

        const allUsers = await usersRepository.findAll();
        const role = allUsers.length === 0 ? 'Admin' : 'User';

        const hash = await bcrypt.hash(password, 10);
        const newUser = await usersRepository.create({email, username, hash, role});

        const userData = {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username
        };

        return NextResponse.json(userData);
    });
}