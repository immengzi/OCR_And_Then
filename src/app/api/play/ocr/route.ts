import {NextRequest, NextResponse} from "next/server";
import {AppError} from "@/lib/types/errors";
import OpenAI from 'openai';
import {recordsRepository} from "@/server/repositories/records-repo";
import {withErrorHandler} from "@/server/middleware/api-utils";

export async function POST(req: NextRequest) {
    return withErrorHandler(async () => {
        const contentType = req.headers.get('content-type');
        if (!contentType?.includes('multipart/form-data')) {
            throw AppError.BadRequest('Content-Type must be multipart/form-data');
        }

        const formData = await req.formData();
        const file = formData.get('file');
        const userId = formData.get('userId') as string;
        const filePath = formData.get('filePath') as string;

        if (!file || !(file instanceof File)) {
            throw AppError.NotFound('File not found or invalid file type');
        }

        const ocrResult = await performOCR(file);

        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        formatOCR(userId, filePath, ocrResult, writer);

        return new NextResponse(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    });
}

async function formatOCR(userId: string, filePath: string, ocrResult: string, writer: WritableStreamDefaultWriter) {
    const gptClient = new OpenAI({
        baseURL: process.env.GPT_API_URL || '',
        apiKey: process.env.GPT_API_KEY || ''
    });
    const buildOcrPrompt = process.env.BUILD_OCR_PROMPT || '';
    const buildOcrTxt = buildOcrPrompt + '\n' + ocrResult;
    const gptApiModel = process.env.GPT_API_MODEL || '';
    let fullResult = '';

    const buildOcrStream = await gptClient.chat.completions.create({
        model: gptApiModel,
        messages: [{role: 'user', content: buildOcrTxt}],
        stream: true
    });

    const encoder = new TextEncoder();

    for await (const chunk of buildOcrStream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
            fullResult += content;
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
        }
    }

    await recordsRepository.create({
        userId,
        action: 'ocr',
        input: filePath,
        result: fullResult
    });

    await writer.close();
}

async function performOCR(file: File) {
    const accessToken = await getAccessToken();
    const sampleBase64 = await getFileContentAsBase64ByFile(file);

    const postData: Record<string, string | boolean> = {
        'detect_direction': false,
        'detect_language': false,
        'vertexes_location': false,
        'paragraph': false,
        'probability': false
    };

    if (file.type === 'application/pdf') {
        postData.pdf_file = sampleBase64;
    } else if (file.type.startsWith('image/')) {
        postData.image = sampleBase64;
    } else {
        throw AppError.BadRequest('Unsupported file type. Only PDF and images are supported.');
    }

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(postData)) {
        formData.append(key, value.toString());
    }

    const response = await fetch(
        `https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=${accessToken}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: formData.toString()
        }
    );

    if (!response.ok) {
        throw AppError.ServerError(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error_code) {
        throw AppError.ServerError(`API error: ${result.error_msg}`);
    }

    if (result.words_result) {
        return result.words_result.map((item: { words: string }) => item.words).join('\n');
    }

    return result;
}

async function getAccessToken() {
    const clientId = process.env.BAIDUYUN_OCR_API_KEY;
    const clientSecret = process.env.BAIDUYUN_OCR_SECRET_KEY;

    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw AppError.ServerError(`Failed to get access token. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

async function getFileContentAsBase64ByFile(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString('base64');
}