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

type IPStats = {
    "STATUS": {
        "STATUS": "string",
        "when": 1703024668,
        "Msg": "stats",
        "api_version": "1.0.0"
    },
    "INFO": {
        "miner_version": "uart_trans.1.3",
        "CompileTime": "Sat Mar 11 14:02:23 CST 2023",
        "type": "Antminer S19Pro+"
    },
    "STATS": [
        {
            "elapsed": 17065,
            "rate_5s": 121056.23,
            "rate_30m": 121386.29,
            "rate_avg": 121523.8,
            "rate_ideal": 120000.0,
            "rate_unit": "GH/s",
            "chain_num": 3,
            "fan_num": 4,
            "fan": [
                3270,
                3420,
                3510,
                3510
            ],
            "hwp_total": 0.0025,
            "miner-mode": 0,
            "freq-level": 100,
            "chain": [
                {
                    "index": 0,
                    "freq_avg": 660,
                    "rate_ideal": 40708.0,
                    "rate_real": 40044.21,
                    "asic_num": 120,
                    "asic": " ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo",
                    "temp_pic": [
                        17,
                        17,
                        48,
                        48
                    ],
                    "temp_pcb": [
                        27,
                        27,
                        58,
                        58
                    ],
                    "temp_chip": [
                        32,
                        32,
                        63,
                        63
                    ],
                    "hw": 4,
                    "eeprom_loaded": true,
                    "sn": "YNAHYR5BCJCBG0NMS",
                    "hwp": 0.0033,
                    "tpl": [
                        [
                            3,
                            4,
                            9,
                            10,
                            15,
                            16,
                            21,
                            22,
                            27,
                            28
                        ],
                        [
                            2,
                            5,
                            8,
                            11,
                            14,
                            17,
                            20,
                            23,
                            26,
                            29
                        ],
                        [
                            1,
                            6,
                            7,
                            12,
                            13,
                            18,
                            19,
                            24,
                            25,
                            30
                        ],
                        [
                            60,
                            55,
                            54,
                            49,
                            48,
                            43,
                            42,
                            37,
                            36,
                            31
                        ],
                        [
                            59,
                            56,
                            53,
                            50,
                            47,
                            44,
                            41,
                            38,
                            35,
                            32
                        ],
                        [
                            58,
                            57,
                            52,
                            51,
                            46,
                            45,
                            40,
                            39,
                            34,
                            33
                        ],
                        [
                            63,
                            64,
                            69,
                            70,
                            75,
                            76,
                            81,
                            82,
                            87,
                            88
                        ],
                        [
                            62,
                            65,
                            68,
                            71,
                            74,
                            77,
                            80,
                            83,
                            86,
                            89
                        ],
                        [
                            61,
                            66,
                            67,
                            72,
                            73,
                            78,
                            79,
                            84,
                            85,
                            90
                        ],
                        [
                            120,
                            115,
                            114,
                            109,
                            108,
                            103,
                            102,
                            97,
                            96,
                            91
                        ],
                        [
                            119,
                            116,
                            113,
                            110,
                            107,
                            104,
                            101,
                            98,
                            95,
                            92
                        ],
                        [
                            118,
                            117,
                            112,
                            111,
                            106,
                            105,
                            100,
                            99,
                            94,
                            93
                        ]
                    ]
                },
                {
                    "index": 1,
                    "freq_avg": 660,
                    "rate_ideal": 40708.0,
                    "rate_real": 39582.42,
                    "asic_num": 120,
                    "asic": " ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo",
                    "temp_pic": [
                        21,
                        21,
                        51,
                        51
                    ],
                    "temp_pcb": [
                        31,
                        31,
                        61,
                        61
                    ],
                    "temp_chip": [
                        36,
                        36,
                        66,
                        66
                    ],
                    "hw": 3,
                    "eeprom_loaded": true,
                    "sn": "YNAHYR5BCJCBG0P5L",
                    "hwp": 0.0025,
                    "tpl": [
                        [
                            3,
                            4,
                            9,
                            10,
                            15,
                            16,
                            21,
                            22,
                            27,
                            28
                        ],
                        [
                            2,
                            5,
                            8,
                            11,
                            14,
                            17,
                            20,
                            23,
                            26,
                            29
                        ],
                        [
                            1,
                            6,
                            7,
                            12,
                            13,
                            18,
                            19,
                            24,
                            25,
                            30
                        ],
                        [
                            60,
                            55,
                            54,
                            49,
                            48,
                            43,
                            42,
                            37,
                            36,
                            31
                        ],
                        [
                            59,
                            56,
                            53,
                            50,
                            47,
                            44,
                            41,
                            38,
                            35,
                            32
                        ],
                        [
                            58,
                            57,
                            52,
                            51,
                            46,
                            45,
                            40,
                            39,
                            34,
                            33
                        ],
                        [
                            63,
                            64,
                            69,
                            70,
                            75,
                            76,
                            81,
                            82,
                            87,
                            88
                        ],
                        [
                            62,
                            65,
                            68,
                            71,
                            74,
                            77,
                            80,
                            83,
                            86,
                            89
                        ],
                        [
                            61,
                            66,
                            67,
                            72,
                            73,
                            78,
                            79,
                            84,
                            85,
                            90
                        ],
                        [
                            120,
                            115,
                            114,
                            109,
                            108,
                            103,
                            102,
                            97,
                            96,
                            91
                        ],
                        [
                            119,
                            116,
                            113,
                            110,
                            107,
                            104,
                            101,
                            98,
                            95,
                            92
                        ],
                        [
                            118,
                            117,
                            112,
                            111,
                            106,
                            105,
                            100,
                            99,
                            94,
                            93
                        ]
                    ]
                },
                {
                    "index": 2,
                    "freq_avg": 660,
                    "rate_ideal": 40708.0,
                    "rate_real": 41429.6,
                    "asic_num": 120,
                    "asic": " ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo ooo",
                    "temp_pic": [
                        18,
                        18,
                        48,
                        48
                    ],
                    "temp_pcb": [
                        28,
                        28,
                        58,
                        58
                    ],
                    "temp_chip": [
                        33,
                        33,
                        63,
                        63
                    ],
                    "hw": 2,
                    "eeprom_loaded": true,
                    "sn": "YNAHYR5BCJCBG0NT6",
                    "hwp": 0.0016,
                    "tpl": [
                        [
                            3,
                            4,
                            9,
                            10,
                            15,
                            16,
                            21,
                            22,
                            27,
                            28
                        ],
                        [
                            2,
                            5,
                            8,
                            11,
                            14,
                            17,
                            20,
                            23,
                            26,
                            29
                        ],
                        [
                            1,
                            6,
                            7,
                            12,
                            13,
                            18,
                            19,
                            24,
                            25,
                            30
                        ],
                        [
                            60,
                            55,
                            54,
                            49,
                            48,
                            43,
                            42,
                            37,
                            36,
                            31
                        ],
                        [
                            59,
                            56,
                            53,
                            50,
                            47,
                            44,
                            41,
                            38,
                            35,
                            32
                        ],
                        [
                            58,
                            57,
                            52,
                            51,
                            46,
                            45,
                            40,
                            39,
                            34,
                            33
                        ],
                        [
                            63,
                            64,
                            69,
                            70,
                            75,
                            76,
                            81,
                            82,
                            87,
                            88
                        ],
                        [
                            62,
                            65,
                            68,
                            71,
                            74,
                            77,
                            80,
                            83,
                            86,
                            89
                        ],
                        [
                            61,
                            66,
                            67,
                            72,
                            73,
                            78,
                            79,
                            84,
                            85,
                            90
                        ],
                        [
                            120,
                            115,
                            114,
                            109,
                            108,
                            103,
                            102,
                            97,
                            96,
                            91
                        ],
                        [
                            119,
                            116,
                            113,
                            110,
                            107,
                            104,
                            101,
                            98,
                            95,
                            92
                        ],
                        [
                            118,
                            117,
                            112,
                            111,
                            106,
                            105,
                            100,
                            99,
                            94,
                            93
                        ]
                    ]
                }
            ]
        }
    ]
}