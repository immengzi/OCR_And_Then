import {NextResponse} from 'next/server'

type ApiHandler<T = unknown> = {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        details?: unknown
    }
}

export class ApiResponseHandler {
    static success<T>(data: T, status: number = 200): NextResponse {
        const response: ApiHandler<T> = {
            success: true,
            data
        }
        return NextResponse.json(response, {status})
    }

    static error(
        message: string,
        status: number = 400,
        code: string = 'BAD_REQUEST',
        details?: any
    ): NextResponse {
        const response: ApiHandler = {
            success: false,
            error: {
                code,
                message,
                details
            }
        }
        return NextResponse.json(response, {status})
    }

    static unauthorized(message: string = 'Unauthorized'): NextResponse {
        return this.error(message, 401, 'UNAUTHORIZED')
    }

    static forbidden(message: string = 'Forbidden'): NextResponse {
        return this.error(message, 403, 'FORBIDDEN')
    }

    static notFound(message: string = 'Resource not found'): NextResponse {
        return this.error(message, 404, 'NOT_FOUND')
    }

    static validationError(errors: Record<string, string[]>): NextResponse {
        return this.error(
            'Validation failed',
            422,
            'VALIDATION_ERROR',
            errors
        )
    }

    static serverError(error: Error): NextResponse {
        console.error('Server error:', error)

        // 生产环境下不返回具体错误信息
        const isProd = process.env.NODE_ENV === 'production'
        const message = isProd ?
            'Internal server error' :
            error.message

        return this.error(message, 500, 'SERVER_ERROR')
    }
}