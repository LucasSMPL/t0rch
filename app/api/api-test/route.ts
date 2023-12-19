import { NextRequest, NextResponse } from 'next/server';
import DigestClient from 'digest-fetch';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const client = new DigestClient('root', 'root', { basic: false });
        // const ips = ['10.0.215.1', '10.0.215.2', '10.0.215.3', '10.0.215.4', '10.0.215.5'];
        const responses = [];


            const res = await client.fetch(`http://10.0.215.2/cgi-bin/summary.cgi`);
            const data = await res.json();
            console.log(data);
            responses.push(data);

        return NextResponse.json({
            status: 200,
            data: responses,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: 500,
            message: (error as Error).message,
        });
    }
}
