import {NextRequest} from 'next/server';
import {AppError} from '@/lib/types/errors';
import {z} from 'zod';

export function validateRequest<T>(schema: z.Schema<T>) {
    return async (request: NextRequest) => {
        try {
            const body = await request.json();
            return schema.parse(body);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = Object.fromEntries(
                    error.errors.map(err => [
                        err.path.join('.'),
                        err.message
                    ])
                );

                throw AppError.BadRequest(
                    'Validation failed',
                    fieldErrors
                );
            }
            if (error instanceof SyntaxError) {
                throw AppError.BadRequest('Invalid JSON format');
            }

            throw AppError.ServerError('Request processing failed');
        }
    }
}