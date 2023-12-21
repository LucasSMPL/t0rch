import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            let promises = [];
            for (let i = 1; i <= 10; i++) {
                promises.push(test(i, encoder, controller));
            }
            await Promise.allSettled(promises);

            controller.close();
        },
    });

    return new NextResponse(stream);
}

async function test(i: number, encoder: TextEncoder, controller: ReadableStreamDefaultController) {
    await new Promise(r => setTimeout(r, Math.random() * 1000)).then(() => {
        const result = { result: i };
        console.log(result);

        const queue = encoder.encode(JSON.stringify(result));
        controller.enqueue(queue);
    });
}