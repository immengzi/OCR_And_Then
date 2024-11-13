export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public data?: any
    ) {
        super(message);
        this.name = 'AppError';
    }

    static BadRequest(message: string = 'Invalid request parameters', data?: any) {
        return new AppError(message, 400, data);
    }

    static Unauthorized(message: string = 'Authentication required') {
        return new AppError(message, 401);
    }

    static Forbidden(message: string = 'Permission denied') {
        return new AppError(message, 403);
    }

    static NotFound(message: string = 'Resource not found') {
        return new AppError(message, 404);
    }

    static TooManyRequests(message: string = 'Too many requests') {
        return new AppError(message, 429);
    }

    static ServerError(message: string = 'Internal server error') {
        return new AppError(message, 500);
    }
}