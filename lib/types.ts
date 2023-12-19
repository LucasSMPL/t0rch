type ScannedIp = {
    id: number,
    ip: string,
    miner_type: string,
    // worker: string,
    // pool_1: string,
    uptime: number,
    hashrate: number,
    // fan_count: string,
    // hb_count: string,
    // psu_type: string,
    // controller: string,
}

type IpScannerApiRes = {
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