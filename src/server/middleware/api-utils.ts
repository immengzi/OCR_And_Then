import {NextResponse} from "next/server";
import {AppError} from "@/lib/types/errors";

export async function withErrorHandler(handler: () => Promise<NextResponse>) {
    try {
        return await handler();
    } catch (error) {
        // console.error('API Error:', error);

        if (error instanceof AppError) {
            return NextResponse.json(
                {message: error.message, data: error.data},
                {status: error.statusCode}
            );
        }

        return NextResponse.json(
            {message: 'Internal server error'},
            {status: 500}
        );
    }
}