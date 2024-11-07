import {NextRequest} from 'next/server';
import {z} from 'zod';
import {ApiResponseHandler} from './api-handler';

export function validateRequest<T>(schema: z.Schema<T>) {
    return async (request: NextRequest) => {
        try {
            const body = await request.json();
            const validatedData = schema.parse(body);
            return {success: true, data: validatedData};
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {
                    success: false,
                    error: ApiResponseHandler.validationError(
                        Object.fromEntries(
                            error.errors.map(err => [
                                err.path.join('.'),
                                [err.message]
                            ])
                        )
                    )
                }
            }
            return {
                success: false,
                error: ApiResponseHandler.serverError(error as Error)
            }
        }
    }
}