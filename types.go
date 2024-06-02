package main

type TorchConfig struct {
	Version string `json:"version"`
}
type ScannedIp struct {
	Ip             string  `json:"ip"`
	IsFound        bool    `json:"is_found"`
	MinerType      string  `json:"miner_type"`
	Worker         string  `json:"worker"`
	Uptime         int     `json:"uptime"`
	Hashrate       float64 `json:"hashrate"`
	FanCount       int     `json:"fan_count"`
	HbCount        int     `json:"hb_count"`
	PowerType      string  `json:"power_type"`
	Controller     string  `json:"controller"`
	HashboardType  string  `json:"hashboard_type"`
	IsUnderhashing bool    `json:"is_underhashing"`
	ModelFound     bool    `json:"model_found"`
	PsuFailure     bool    `json:"psu_failure"`
	RateIdeal      float64 `json:"rate_ideal"`
	CompileTime    string  `json:"compile_time"`
	Url            string  `json:"url"`
}

type IpSummary struct {
	Status struct {
		Status     string `json:"STATUS"`
		When       int    `json:"when"`
		Msg        string `json:"Msg"`
		ApiVersion string `json:"api_version"`
	} `json:"STATUS"`
	Info struct {
		MinerVersion string `json:"miner_version"`
		CompileTime  string `json:"CompileTime"`
		Type         string `json:"type"`
	} `json:"INFO"`
	Summary []struct {
		Elapsed   int     `json:"elapsed"`
		Rate_5s   float64 `json:"rate_5s"`
		Rate_30m  float64 `json:"rate_30m"`
		RateAvg   float64 `json:"rate_avg"`
		RateIdeal float64 `json:"rate_ideal"`
		RateUnit  string  `json:"rate_unit"`
		HwAll     int     `json:"hw_all"`
		BestShare int     `json:"bestshare"`
		Status    []struct {
			Type   string `json:"type"`
			Status string `json:"status"`
			Code   int    `json:"code"`
			Msg    string `json:"msg"`
		} `json:"status"`
	} `json:"SUMMARY"`
}

type IpStats struct {
	Status struct {
		Status     string `json:"STATUS"`
		When       int    `json:"when"`
		Msg        string `json:"Msg"`
		APIVersion string `json:"api_version"`
	} `json:"STATUS"`
	Info struct {
		MinerVersion string `json:"miner_version"`
		CompileTime  string `json:"CompileTime"`
		Type         string `json:"type"`
	} `json:"INFO"`
	Stats []struct {
		Elapsed   int     `json:"elapsed"`
		Rate5S    float64 `json:"rate_5s"`
		Rate30M   float64 `json:"rate_30m"`
		RateAvg   float64 `json:"rate_avg"`
		RateIdeal float64 `json:"rate_ideal"`
		RateUnit  string  `json:"rate_unit"`
		ChainNum  int     `json:"chain_num"`
		FanNum    int     `json:"fan_num"`
		Fan       []int   `json:"fan"`
		HwpTotal  float64 `json:"hwp_total"`
		MinerMode int     `json:"miner-mode"`
		FreqLevel int     `json:"freq-level"`
		Chain     []struct {
			Index        int     `json:"index"`
			FreqAvg      int     `json:"freq_avg"`
			RateIdeal    float64 `json:"rate_ideal"`
			RateReal     float64 `json:"rate_real"`
			AsicNum      int     `json:"asic_num"`
			Asic         string  `json:"asic"`
			TempPic      []int   `json:"temp_pic"`
			TempPcb      []int   `json:"temp_pcb"`
			TempChip     []int   `json:"temp_chip"`
			Hw           int     `json:"hw"`
			EepromLoaded bool    `json:"eeprom_loaded"`
			Sn           string  `json:"sn"`
			Hwp          float64 `json:"hwp"`
		} `json:"chain"`
	} `json:"STATS"`
}

type IpMinerConf struct {
	Pools []struct {
		Url  string `json:"url"`
		User string `json:"user"`
		Pass string `json:"pass"`
	} `json:"pools"`
	ApiListen        bool   `json:"api-listen"`
	ApiNetwork       bool   `json:"api-network"`
	ApiGroups        string `json:"api-groups"`
	ApiAllow         string `json:"api-allow"`
	BitmainFanCtrl   bool   `json:"bitmain-fan-ctrl"`
	BitmainFanPwm    string `json:"bitmain-fan-pwm"`
	BitmainUseVil    bool   `json:"bitmain-use-vil"`
	BitmainFreq      string `json:"bitmain-freq"`
	BitmainVoltage   string `json:"bitmain-voltage"`
	BitmainCcdelay   string `json:"bitmain-ccdelay"`
	BitmainPwth      string `json:"bitmain-pwth"`
	BitmainWorkMode  string `json:"bitmain-work-mode"`
	BitmainFreqLevel string `json:"bitmain-freq-level"`
}

type MinerModel struct {
	Id             int     `json:"id"`
	Name           string  `json:"name"`
	Model          string  `json:"model"`
	IdManufacturer int     `json:"id_manufacturer"`
	HashRate       float64 `json:"hashrate"`
	Power          float64 `json:"power"`
}

type IpChart struct {
	Status struct {
		Status     string  `json:"STATUS"`
		When       float64 `json:"when"`
		Msg        string  `json:"Msg"`
		ApiVersion string  `json:"api_version"`
	} `json:"STATUS"`
	Info struct {
		MinerVersion string `json:"miner_version"`
		CompileTime  string `json:"CompileTime"`
		Type         string `json:"type"`
	} `json:"INFO"`
	Rate []struct {
		Unit   string   `json:"unit"`
		Xaxis  []string `json:"xAxis"`
		Series []struct {
			Name string    `json:"name"`
			Data []float64 `json:"data"`
		} `json:"series"`
	} `json:"RATE"`
}

type NetworkInfo struct {
	Nettype        string `json:"nettype"`
	Netdevice      string `json:"netdevice"`
	Macaddr        string `json:"macaddr"`
	Ipaddress      string `json:"ipaddress"`
	Netmask        string `json:"netmask"`
	ConfNettype    string `json:"conf_nettype"`
	ConfHostname   string `json:"conf_hostname"`
	ConfIpaddress  string `json:"conf_ipaddress"`
	ConfNetmask    string `json:"conf_netmask"`
	ConfGateway    string `json:"conf_gateway"`
	ConfDnsservers string `json:"conf_dnsservers"`
}
