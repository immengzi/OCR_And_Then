import {ApiResponseHandler} from '@/server/middleware/api-handler'

export async function POST() {
    try {
        const response = ApiResponseHandler.success(
            {
                message: 'Logout successful'
            },
            200
        )

        response.cookies.set('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
        } as any)

        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
        } as any)

        return response
    } catch (error) {
        return ApiResponseHandler.serverError(error)
    }
}