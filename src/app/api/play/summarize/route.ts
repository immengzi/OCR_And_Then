import {NextRequest, NextResponse} from "next/server";
import {AppError} from "@/lib/types/errors";
import OpenAI from 'openai';
import {withErrorHandler} from "@/server/middleware/api-utils";

export async function POST(req: NextRequest) {
    return withErrorHandler(async () => {
    });
}