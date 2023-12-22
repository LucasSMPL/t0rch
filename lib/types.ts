type ScannedIp = {
    id: number,
    ip: string,
    miner_type: string,
    worker: string,
    // pool_1: string,
    uptime: number,
    hashrate: number,
    fan_count: number,
    hb_count: number,
    power_type: string,
    controller: string,
    is_underhashing: boolean
}
type IpRange = {
    label: string;
    address: string;
    start: number;
    end: number;
};
// type StreamRes<T> = {
//     result: T,
//     total: number,
//     done: number,
// }

type IpSummary = {
    STATUS: {
        STATUS: string,
        when: number,
        Msg: string,
        api_version: string,
    },
    INFO: {
        miner_version: string,
        CompileTime: string,
        type: string,
    },
    SUMMARY: [
        {
            elapsed: number,
            rate_5s: number,
            rate_30m: number,
            rate_avg: number,
            rate_ideal: number,
            rate_unit: string,
            hw_all: number,
            bestshare: number,
            status: {
                type: string,
                status: string,
                code: number,
                msg: string
            }[]
        }
    ]
}

type IpStats = {
    STATUS: {
        STATUS: string,
        when: number,
        Msg: string,
        api_version: string
    },
    INFO: {
        miner_version: string
        CompileTime: string
        type: string
    },
    STATS: [
        {
            elapsed: number
            rate_5s: number
            rate_30m: number
            rate_avg: number
            rate_ideal: number
            rate_unit: string
            chain_num: number
            fan_num: number
            fan: number[],
            hwp_total: number,
            "miner-mode": number
            "freq-level": number
            chain: {
                index: number
                freq_avg: number
                rate_ideal: number
                rate_real: number
                asic_num: number
                asic: string,
                temp_pic: number[],
                temp_pcb: number[],
                temp_chip: number[],
                hw: number,
                eeprom_loaded: boolean,
                sn: string,
                hwp: number,
                tpl: number[][]
            }[],

        }
    ]
}
type IpMiner = {
    "pools": [
        {
            url: string,
            user: string,
            pass: string,
        },
        {
            url: string,
            user: string,
            pass: string,
        },
        {
            url: string,
            user: string,
            pass: string,
        }
    ],
    "api-listen": boolean,
    "api-network": boolean,
    "api-groups": string,
    "api-allow": string,
    "bitmain-fan-ctrl": boolean,
    "bitmain-fan-pwm": string,
    "bitmain-use-vil": boolean,
    "bitmain-freq": string,
    "bitmain-voltage": string,
    "bitmain-ccdelay": string,
    "bitmain-pwth": string,
    "bitmain-work-mode": string,
    "bitmain-freq-level": string
}