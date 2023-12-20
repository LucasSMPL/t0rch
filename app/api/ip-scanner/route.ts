import { Database } from "@/types";
import { createClient } from "@supabase/supabase-js";
import DigestClient from 'digest-fetch';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

function hexToLabel(hexCode: number): string {
    const hexLabelMapping: { [key: number]: string } = {
        0x71: "APW121215a",
        0x72: "APW121215b",
        0x73: "APW121417a",
        0x75: "APW121215e",
        0x76: "APW121215f",
        0x77: "APW121215d",
        0x78: "APW121417b",
        0xc1: "APW171215a",
    };
    return hexLabelMapping[hexCode] || "Unknown";
}

function parseLogData(logData: string): { controller: string; power_type: string } {
    let controller = "N/A";
    let power_type = "Unknown";

    const powerMatch = logData.match(/power type version: (0x[0-9a-fA-F]+)/);
    if (powerMatch && powerMatch[1]) {
        power_type = hexToLabel(parseInt(powerMatch[1], 16));
    }

    const controllerKeywords = ["Xilinx", "amlogic", "BeagleBone"];
    for (const word of controllerKeywords) {
        if (logData.includes(word)) {
            controller = word;
            break;
        }
    }

    return { controller, power_type };
}

export async function POST(request: NextRequest) {
    try {
        const {
            address,
            end,
            start,
        }: {
            address: string;
            start: number;
            end: number;
        } = await request.json();

        const supabase = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!,
        );

        const { data: models, error } = await supabase.from('miner_models').select('*,manufacturer:manufacturers(*)');
        if (error) throw Error(error.message);


        const client = new DigestClient("root", "root", { basic: false });

        const stream = new ReadableStream({
            async start(c) {
                const encoder = new TextEncoder();
                let allPrmises: Promise<void>[] = [];
                for (let i = start; i <= end; i++) {
                    allPrmises.push(getIpMetadata(c, encoder, client, address, i, models, end - start + 1));
                }
                await Promise.allSettled(allPrmises);
                c.close();
            },
        });
        return new NextResponse(stream);
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: 500,
            message: (error as Error).message,
        });
    }
}

async function getIpMetadata(
    c: ReadableStreamDefaultController,
    encoder: TextEncoder,
    client: DigestClient,
    address: string,
    i: number,
    models: Models,
    total: number,
): Promise<void> {
    try {
        const summRes = await client.fetch(`http://${address}.${i}/cgi-bin/summary.cgi`);
        const summData: IpSummary = await summRes.json();
        const statsRes = await client.fetch(`http://${address}.${i}/cgi-bin/stats.cgi`);
        const statsData: IpStats = await statsRes.json();
        const minerRes = await client.fetch(`http://${address}.${i}/cgi-bin/get_miner_conf.cgi`);
        const minerData: IpMiner = await minerRes.json();
        const logsRes = await client.fetch(`http://${address}.${i}/cgi-bin/log.cgi`);
        const logsData = await logsRes.text();

        const { controller, power_type } = parseLogData(logsData);

        const model = models.find(e => {
            return `${e.manufacturer!.name} ${e.model} (${e.hashrate}T)` === summData.INFO.type ||
                `${e.manufacturer!.name}Miner ${e.model} (${e.hashrate}T)` === summData.INFO.type ||
                `${e.manufacturer!.name} ${e.model} (${e.hashrate})` === summData.INFO.type ||
                `${e.manufacturer!.name} ${e.model}` === summData.INFO.type;
        });
        if (!model) throw Error(`Model not found: ${summData.INFO.type}`);

        const res: StreamRes<ScannedIp> = {
            result: {
                id: i,
                ip: `${address}.${i}`,
                miner_type: summData.INFO.type,
                // uptime: intervalToDuration({start: 0, end: summData.SUMMARY.at(0)?.elapsed ?? 0}),
                uptime: summData.SUMMARY.at(0)?.elapsed ?? 0,
                hashrate: (summData.SUMMARY.at(0)?.rate_5s ?? 0) / 1000,
                fan_count: statsData.STATS.at(0)?.fan_num ?? 0,
                hb_count: statsData.STATS.at(0)?.chain_num ?? 0,
                worker: minerData.pools[0].user ?? "",
                controller,
                power_type,
                is_underhashing: (summData.SUMMARY.at(0)?.rate_5s ?? 0 / 1000) < (model.hashrate! * 0.8),
            },
            total,
            done: i,
        };
        const queue = encoder.encode(JSON.stringify(res));
        c.enqueue(queue);

    } catch (error) {
        console.error(`Error fetching data for IP ${address}.${i}:`, error);
        const res: StreamRes<ScannedIp> = {
            result: {
                id: i,
                ip: `${address}.${i}`,
                miner_type: "N/A",
                uptime: 0,
                hashrate: 0,
                fan_count: 0,
                hb_count: 0,
                worker: "N/A",
                controller: "N/A",
                power_type: "N/A",
                is_underhashing: false,
            },
            total,
            done: i,
        };
        const queue = encoder.encode(JSON.stringify(res));
        c.enqueue(queue);
    }
}

type Models = {
    hashrate: number | null;
    id: number;
    id_manufacturer: number | null;
    model: string;
    power: number | null;
    manufacturer: {
        id: number;
        name: string;
    } | null;
}[]