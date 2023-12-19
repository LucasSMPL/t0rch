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
            const summRes = await client.fetch(`http://${address}.${i}/cgi-bin/summary.cgi`);
            const summData: IpSummary = await summRes.json();
            const statsRes = await client.fetch(`http://${address}.${i}/cgi-bin/stats.cgi`);
            const statsData: IpStats = await statsRes.json();
            console.log(summData);
            responses.push({
                id: i,
                ip: `${address}.${i}`,
                miner_type: summData.INFO.type,
                uptime: summData.SUMMARY.at(0)?.elapsed ?? 0,
                hashrate: summData.SUMMARY.at(0)?.rate_5s ?? 0,
                fan_count: statsData.STATS.at(0)?.fan_num ?? 0,
                hb_count: statsData.STATS.at(0)?.chain_num ?? 0,
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
