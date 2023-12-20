import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            for (let i = 1; i <= 100; i++) {
                await new Promise(r => setTimeout(r, 1000)); // To emulate a delay
                const queue = encoder.encode(JSON.stringify({ result: i }));
                controller.enqueue(queue);
            }
            controller.close();
        },
    });
    return new NextResponse(stream);
}