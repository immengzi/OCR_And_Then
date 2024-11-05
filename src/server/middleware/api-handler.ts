import {NextResponse} from 'next/server'

enum ErrorCode {
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR'
}

enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500
}

interface ApiError {
    code: ErrorCode;
    message: string;
    details?: unknown;
}

interface ApiSuccess<T> {
    success: true;
    data: T;
}

interface ApiFailure {
    success: false;
    error: ApiError;
}

// type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiResponseHandler {
    static success<T>(data: T, status: HttpStatus = HttpStatus.OK): NextResponse {
        const response: ApiSuccess<T> = {
            success: true,
            data
        }
        return NextResponse.json(response, {status})
    }

    static error(
        message: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
        code: ErrorCode = ErrorCode.BAD_REQUEST,
        details?: unknown
    ): NextResponse {
        const response: ApiFailure = {
            success: false,
            error: {
                code,
                message,
                details
            }
        }
        return NextResponse.json(response, {status})
    }

    static badRequest(message: string = 'Bad request'): NextResponse {
        return this.error(
            message,
            HttpStatus.BAD_REQUEST,
            ErrorCode.BAD_REQUEST
        )
    }

    static unauthorized(message: string = 'Unauthorized'): NextResponse {
        return this.error(
            message,
            HttpStatus.UNAUTHORIZED,
            ErrorCode.UNAUTHORIZED
        )
    }

    static forbidden(message: string = 'Forbidden'): NextResponse {
        return this.error(
            message,
            HttpStatus.FORBIDDEN,
            ErrorCode.FORBIDDEN
        )
    }

    static notFound(message: string = 'Resource not found'): NextResponse {
        return this.error(
            message,
            HttpStatus.NOT_FOUND,
            ErrorCode.NOT_FOUND
        )
    }

    static validationError(errors: Record<string, string[]>): NextResponse {
        return this.error(
            'Validation failed',
            HttpStatus.UNPROCESSABLE_ENTITY,
            ErrorCode.VALIDATION_ERROR,
            errors
        )
    }

    static serverError(error: Error): NextResponse {
        console.error('Server error:', error)

        const isProd = process.env.NODE_ENV === 'production'
        const message = isProd ? 'Internal server error' : error.message

        // 添加错误堆栈信息到详情中(仅开发环境)
        const details = !isProd ? {stack: error.stack} : undefined

        return this.error(
            message,
            HttpStatus.INTERNAL_SERVER_ERROR,
            ErrorCode.SERVER_ERROR,
            details
        )
    }
}