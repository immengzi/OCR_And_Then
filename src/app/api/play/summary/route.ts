import {NextRequest, NextResponse} from "next/server";
import {AppError} from "@/lib/types/errors";
import OpenAI from 'openai';
import {recordsRepository} from "@/server/repositories/records-repo";
import {withErrorHandler} from "@/server/middleware/api-utils";

export async function POST(req: NextRequest) {
    return withErrorHandler(async () => {
        const {content, userId} = await req.json();

        if (!content) {
            throw AppError.BadRequest('Content is required');
        }

        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        generateSummary(content, writer, userId);

        return new NextResponse(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    });
}

async function generateSummary(content: string, writer: WritableStreamDefaultWriter, userId: string) {
    try {
        const gptClient = new OpenAI({
            baseURL: process.env.GPT_API_URL || '',
            apiKey: process.env.GPT_API_KEY || ''
        });

        const buildSummaryPrompt = process.env.BUILD_SUMMARY_PROMPT || '';
        const buildSummaryTxt = buildSummaryPrompt + '\n' + content;
        const gptApiModel = process.env.GPT_API_MODEL || '';
        let fullResult = '';

        const summaryStream = await gptClient.chat.completions.create({
            model: gptApiModel,
            messages: [{ role: 'user', content: buildSummaryTxt }],
            stream: true
        });

        const encoder = new TextEncoder();

        for await (const chunk of summaryStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                fullResult += content;
                await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
        }

        await recordsRepository.create({
            userId,
            action: 'summary',
            input: content,
            result: fullResult
        });
    } catch (error) {
        console.error('Error in generateSummary:', error);
        // 确保错误也被传递给客户端
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        await writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
    } finally {
        await writer.close();
    }
}