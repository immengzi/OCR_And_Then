import { ApiResponseHandler } from '@/server/middleware/api-handler'
import { JwtHelper } from '@/server/middleware/jwt'
import { usersRepository } from '@/server/repositories/users-repo'
import { cookies } from 'next/headers'

export async function GET() {
    try {
        // 1. 获取并检查 access token
        const accessToken = cookies().get('accessToken')?.value
        if (!accessToken) {
            return ApiResponseHandler.unauthorized();
        }

        try {
            // 2. 验证 token
            const decodedToken = await JwtHelper.verifyToken(accessToken)

            // 3. 获取用户信息
            const user = await usersRepository.findById(decodedToken._id)
            if (!user) {
                return ApiResponseHandler.notFound();
            }

            // 4. 返回用户信息
            return ApiResponseHandler.success(
                {
                    message: 'Session is valid',
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                    }
                },
                200
            )
        } catch (tokenError) {
            // 5. 如果 access token 无效，尝试使用 refresh token
            const refreshToken = cookies().get('refreshToken')?.value
            if (!refreshToken) {
                return ApiResponseHandler.unauthorized();
            }

            // 6. 验证 refresh token
            const decodedRefreshToken = await JwtHelper.verifyToken(refreshToken)

            // 7. 获取用户信息
            const user = await usersRepository.findById(decodedRefreshToken._id)
            if (!user) {
                return ApiResponseHandler.notFound();
            }

            // 8. 生成新的 access token
            const newAccessToken = await JwtHelper.generateAccessToken(user)

            const response = ApiResponseHandler.success(
                {
                    message: 'Session refreshed',
                    user: {
                        _id: user._id,
                        username: user.username,
                    }
                },
                200
            )

            // 9. 设置新的 access token
            response.cookies.set('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
            } as any)

            return response
        }
    } catch (error) {
        // 10. 清除无效的 tokens
        const cookieStore = cookies()
        cookieStore.delete('accessToken')
        cookieStore.delete('refreshToken')

        return ApiResponseHandler.serverError(error)
    }
}