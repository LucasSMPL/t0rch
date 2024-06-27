package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/LucasSMPL/t0rch/miners"
	"github.com/LucasSMPL/t0rch/utils"
	"github.com/icholy/digest"
)

func ScanHandler(w http.ResponseWriter, r *http.Request) {
	var ipBases []string
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&ipBases); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(ipBases) == 0 {
		http.Error(w, "No IP Bases Provided", http.StatusBadRequest)
		return
	}
	log.Printf("Scanning: %v", ipBases)

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	ips := []net.IP{}

	for _, subnet := range ipBases {
		for i := 1; i <= 255; i++ {
			ip := fmt.Sprintf("%s.%d", subnet, i)
			parsedIp := net.ParseIP(ip)
			if parsedIp == nil {
				http.Error(w, "Invalid Bases Provided", http.StatusBadRequest)
				return
			}
			ips = append(ips, parsedIp)
		}
	}

	models := getMinerModels()
	if models == nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	resCh := make(chan utils.ScannedIp)
	defer close(resCh)
	ctx := r.Context()

	go func() {
		wg := sync.WaitGroup{}
		concurrencyLimit := 5000
		semaphore := make(chan struct{}, concurrencyLimit)

		for _, ip := range ips {
			wg.Add(1)
			semaphore <- struct{}{}
			go func(ip net.IP) {
				defer wg.Done()
				defer func() { <-semaphore }()
				scanRes := getMinerData(client, ip, *models)
				resCh <- scanRes
			}(ip)
		}

		wg.Wait()
		close(semaphore)
	}()

	// Set headers for SSE
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// Flush the headers to the client
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// stream of scanned IPs
	for {
		select {
		case <-ctx.Done():
			log.Println("Scan aborted by the client")
			return
		case r, ok := <-resCh:
			if !ok {
				return
			}
			jsonData, err := json.Marshal(r)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			fmt.Fprintf(w, "%s\n\n", jsonData)
			flusher.Flush()
		}
	}
}

func getMinerData(
	client *http.Client,
	ip net.IP,
	models []utils.MinerModel,
) utils.ScannedIp {

	ipSummary := miners.GetMinerSummary(client, ip)
	if ipSummary == nil {
		return utils.ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	ipStats := miners.GetMinerStats(client, ip)
	if ipStats == nil {
		return utils.ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	ipLogs := miners.GetMinerLogs(client, ip)
	if ipLogs == nil {
		return utils.ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	ipConf := miners.GetMinerConf(client, ip)
	if ipConf == nil {
		return utils.ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	hashrate := 0.0
	for _, e := range models {
		if e.Name == ipSummary.Info.Type {
			hashrate = e.HashRate
			break
		}
	}

	worker := ""
	if len(ipConf.Pools) > 0 {
		worker = ipConf.Pools[0].User
	}
	url := ""
	if len(ipConf.Pools) > 0 {
		url = ipConf.Pools[0].Url
	}

	elapsed := 0
	rate5s := 0.0
	rateIdeal := 0.0
	CompileTime := ""
	isUnderhashing := false
	if len(ipSummary.Summary) > 0 {
		elapsed = ipSummary.Summary[0].Elapsed
		rate5s = ipSummary.Summary[0].Rate_5s
		rateIdeal = ipSummary.Summary[0].RateIdeal
		CompileTime = ipSummary.Info.CompileTime
		isUnderhashing = (rate5s / 1000) < (float64(hashrate) * 0.8)
	}

	fanNum := 0
	chainNum := 0
	if len(ipStats.Stats) > 0 {
		fanNum = ipStats.Stats[0].FanNum
		chainNum = ipStats.Stats[0].ChainNum
	}

	controller := "N/A"
	powerType := "Unknown"
	hbType := "Unknown"
	psuFailure := false

	controllerKeywords := []string{"Xilinx", "amlogic", "BeagleBone"}
	c := ContainsAny(*ipLogs, controllerKeywords)
	if c != "" {
		controller = c
	}

	psuFailingKeywords := []string{"power voltage can not meet the target", "ERROR_POWER_LOST", "stop_mining: get power type version failed!"}
	if isUnderhashing {
		p := ContainsAny(*ipLogs, psuFailingKeywords)
		if p != "" {
			psuFailure = true
		}
	}

	powerRgx := regexp.MustCompile("power type version: (0x0-9[a-fA-F]+)")
	searchRes := strings.Split(powerRgx.FindString(*ipLogs), " ")
	if len(searchRes) >= 4 {
		powerType = searchRes[3]
	}

	hbModelRgx := regexp.MustCompile("load machine (.*?) conf")
	searchRes = strings.Split(hbModelRgx.FindString(*ipLogs), " ")
	if len(searchRes) >= 4 {
		hbType = searchRes[2]
	}

	scannedIp := utils.ScannedIp{
		Ip:             ip.String(),
		IsFound:        true,
		MinerType:      ipSummary.Info.Type,
		Worker:         worker,
		Uptime:         elapsed,
		Hashrate:       rate5s,
		FanCount:       fanNum,
		HbCount:        chainNum,
		PowerType:      powerType,
		Controller:     controller,
		IsUnderhashing: isUnderhashing,
		HashboardType:  hbType,
		PsuFailure:     psuFailure,
		ModelFound:     hashrate != 0.0,
		RateIdeal:      rateIdeal,
		CompileTime:    CompileTime,
		Url:            url,
	}

	return scannedIp
}

func getMinerModels() *[]utils.MinerModel {
	url := "https://conqcdxbczhqszglmwyk.supabase.co/rest/v1/miner_models?select=*"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return nil
	}

	apiKey := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbnFjZHhiY3pocXN6Z2xtd3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NjM0NDQsImV4cCI6MTk5NTQzOTQ0NH0.LNi12BRKMOOmqW396mjgm_wgJp79U-Ie994EyLlfxnc"

	req.Header.Set("apikey", apiKey)
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return nil
	}
	defer res.Body.Close()

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	fmt.Printf("%s", resBytes)

	var models []utils.MinerModel
	err = json.Unmarshal(resBytes, &models)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &models
}

func ContainsAny(s string, substrings []string) string {
	for _, sub := range substrings {
		if strings.Contains(s, sub) {
			return sub
		}
	}
	return ""
}
