export type ScannedIp = {
  ip: string;
  is_found: boolean;
  miner_type: string;
  worker: string;
  uptime: number;
  hashrate: number;
  fan_count: number;
  hb_count: number;
  power_type: string;
  controller: string;
  hashboard_type: string;
  is_underhashing: boolean;
  model_found: boolean;
  psu_failure: boolean;
  rate_ideal: number; // New
  compile_time: string;
  url: string;
};

export type CustomBase = {
  name: string;
  base: string;
};

export type ChartApiRes = {
  unit: string;
  xAxis: string[];
  series: {
    name: string;
    data: number[];
  }[];
};
