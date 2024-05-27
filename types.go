package main

type ScannedIp struct {
	Ip             string
	MinerType      string
	Worker         string
	Uptime         int
	Hashrate       float64
	FanCount       int
	HbCount        int
	PowerType      string
	Controller     string
	IsUnderhashing bool
	IsFound        bool
	HashboardType  string
	PsuFailure     bool
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
