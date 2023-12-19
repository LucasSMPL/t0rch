import DigestClient from 'digest-fetch';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { address, end, start }: {
            address: string,
            start: number,
            end: number,
        } = await request.json();
        const client = new DigestClient('root', 'root', { basic: false });

        const responses: ScannedIp[] = [];

        for (let i = start; i < end + 1; i++) {
            const res = await client.fetch(`http://${address}.${i}/cgi-bin/summary.cgi`);
            const data: IpScannerApiRes = await res.json();
            console.log(data);
            responses.push({
                id: i,
                ip: `${address}.${i}`,
                miner_type: data.INFO.type,
                uptime: data.SUMMARY.at(0)?.elapsed ?? 0,
                hashrate: data.SUMMARY.at(0)?.rate_5s ?? 0,
            });
        }

        return NextResponse.json(responses);

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: 500,
            message: (error as Error).message,
        });
    }
}
