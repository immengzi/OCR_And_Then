import {NextResponse} from 'next/server';
import {AppError} from "@/lib/types/errors";
import {usersRepository} from "@/server/repositories/users-repo";
import {withErrorHandler} from "@/server/middleware/api-utils";

export async function PATCH(
    request: Request,
    {params}: { params: { userId: string } }
) {
    return withErrorHandler(async () => {
        const {userId} = params;
        const body = await request.json();

        if (body.type === 'username') {
            const {newUsername} = body;
            const updatedUser = await usersRepository.updateUsername(userId, newUsername);
            return NextResponse.json({user: updatedUser});
        }

        if (body.type === 'password') {
            const {currentPassword, newPassword} = body;
            const updatedUser = await usersRepository.updatePassword(
                userId,
                currentPassword,
                newPassword
            );
            return NextResponse.json({user: updatedUser});
        }

        throw AppError.BadRequest('Invalid update type');
    });
}