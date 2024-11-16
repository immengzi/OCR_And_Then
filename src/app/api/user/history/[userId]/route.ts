import {NextResponse} from "next/server";
import {AppError} from "@/lib/types/errors";
import {recordsRepository} from "@/server/repositories/records-repo";
import {withErrorHandler} from "@/server/middleware/api-utils";
import {cookies} from "next/headers";
import {JwtHelper} from "@/server/middleware/jwt";

export async function GET(
    request: Request,
    {params}: { params: { userId: string } }
) {
    return withErrorHandler(async () => {
        const {userId} = params;

        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        if (!accessToken) {
            throw AppError.Unauthorized();
        }

        const decodedToken = await JwtHelper.verifyToken(accessToken);
        if (decodedToken._id !== userId) {
            throw AppError.Unauthorized('Invalid user');
        }

        const history = await recordsRepository.findByUserId(userId);
        return NextResponse.json({history});
    });
}