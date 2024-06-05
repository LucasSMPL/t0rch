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

export type NetworkInfo  = {
	nettype: string
	netdevice: string
	macaddr: string
	ipaddress: string
	netmask: string
	conf_nettype: string
	conf_hostname: string
	conf_ipaddress: string
	conf_netmask: string
	conf_gateway: string
	conf_dnsservers: string
}

export type Chain = {
  index: number;
  freq_avg: number;
  rate_ideal: number;
  rate_real: number;
  asic_num: number;
  asic: string;
  temp_pic: number[];
  temp_pcb: number[];
  temp_chip: number[];
  hw: number;
  eeprom_loaded: boolean;
  sn: string;
  hwp: number;
}