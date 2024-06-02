package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/icholy/digest"
	"github.com/sanbornm/go-selfupdate/selfupdate"
	"github.com/skratchdot/open-golang/open"
)

//go:embed all:frontend/dist
var reactFS embed.FS

func main() {

	var version = GetVersion()

	var binUrl = "https://conqcdxbczhqszglmwyk.supabase.co/storage/v1/object/public/"

	var updater = &selfupdate.Updater{
		CurrentVersion: version,
		ApiURL:         binUrl,
		BinURL:         binUrl,
		DiffURL:        binUrl,
		CmdName:        "t0rch",
		ForceCheck:     true,
		OnSuccessfulUpdate: func() {
			log.Println("-----------------Successfully Updated-----------------")
		},
	}

	go updater.BackgroundRun()

	distFS, err := fs.Sub(reactFS, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}

	router := http.NewServeMux()

	router.Handle("GET /", http.FileServer(http.FS(distFS)))
	router.HandleFunc("POST /scan", scanHandler)                            // Find Antminers
	router.HandleFunc("GET /hashrate_history/{ip}", hashrateHistoryHandler) // Hashrate Chart Antminer
	router.HandleFunc("POST /blink", blinkHandler)                          // Blink ON Antminer
	router.HandleFunc("POST /reboot", rebootHandler)                        // Reboot Antminer
	router.HandleFunc("POST /pool", poolHandler)                            // Change Pool Antminer
	router.HandleFunc("POST /factory_reset", factoryResetHandler)           // Factory Reset Antminer
	router.HandleFunc("GET /log", showLogHandler)                           // Show Log Antminer
	router.HandleFunc("GET /ip_settings", ipSettingsHandler)                // Get Network Info Antminer
	router.HandleFunc("POST /tcp", tcpHandler)                              // Find Whatsminer

	server := http.Server{
		Addr:    ":7070",
		Handler: router,
	}

	// log.Printf("Version: %s\n", version)
	log.Println("Starting HTTP server at http://localhost:7070")

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		log.Fatal(server.ListenAndServe())
	}()

	open.Start("http://localhost:7070")
	wg.Wait()

}

func hashrateHistoryHandler(w http.ResponseWriter, r *http.Request) {
	var param = r.PathValue("ip")
	var ip = net.ParseIP(param)

	if ip == nil {
		http.Error(w, "Invalid IP Provided", http.StatusBadRequest)
		return
	}

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	apiEndpoint := "/cgi-bin/chart.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		fmt.Println(err)
		fmt.Fprintln(w, err)
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Println(res.Status)
		fmt.Fprintf(w, "Status is: %s", res.Status)
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		fmt.Fprintln(w, err)
	}

	var ipChart IpChart
	err = json.Unmarshal(resBytes, &ipChart)
	if err != nil {
		fmt.Println(err)
		fmt.Fprintln(w, err)
	}

	io.Copy(io.Discard, res.Body)

	jsonData, err := json.Marshal(ipChart)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%v", jsonData)

}

func scanHandler(w http.ResponseWriter, r *http.Request) {
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

	resCh := make(chan ScannedIp)

	go func() {
		scanAllIps(client, ips, resCh, *models)
		close(resCh)
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
	for r := range resCh {
		jsonData, err := json.Marshal(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(w, "%s\n\n", jsonData)
		fmt.Printf("%s", jsonData)
		flusher.Flush()
	}
}

func scanAllIps(client *http.Client, ips []net.IP, resCh chan<- ScannedIp, models []MinerModel) {

	wg := sync.WaitGroup{}
	concurrencyLimit := 200
	semaphore := make(chan struct{}, concurrencyLimit)

	for _, ip := range ips {
		wg.Add(1)
		semaphore <- struct{}{}
		go func(ip net.IP) {
			defer wg.Done()
			defer func() { <-semaphore }()
			scanRes := getMinerData(client, ip, models)
			resCh <- scanRes
		}(ip)
	}

	wg.Wait()
	close(semaphore)
}

func getMinerData(
	client *http.Client,
	ip net.IP,
	models []MinerModel,
) ScannedIp {

	ipSummary := getMinerSummary(client, ip)
	if ipSummary == nil {
		return ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	ipStats := getMinerStats(client, ip)
	if ipStats == nil {
		return ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	ipLogs := getMinerLogs(client, ip)
	if ipLogs == nil {
		return ScannedIp{
			Ip:      ip.String(),
			IsFound: false,
		}
	}

	ipConf := getMinerConf(client, ip)
	if ipConf == nil {
		return ScannedIp{
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

	scannedIp := ScannedIp{
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

func getMinerSummary(
	client *http.Client,
	ip net.IP,
) *IpSummary {
	apiEndpoint := "/cgi-bin/summary.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Println(res.Status)
		return nil
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var ipSummary IpSummary
	err = json.Unmarshal(resBytes, &ipSummary)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &ipSummary
}

func getMinerStats(
	client *http.Client,
	ip net.IP,
) *IpStats {
	apiEndpoint := "/cgi-bin/stats.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Println(res.Status)
		return nil
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var ipStats IpStats
	err = json.Unmarshal(resBytes, &ipStats)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &ipStats
}

func getMinerConf(
	client *http.Client,
	ip net.IP,
) *IpMinerConf {
	apiEndpoint := "/cgi-bin/get_miner_conf.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Println(res.Status)
		return nil
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var ipMinerConf IpMinerConf
	err = json.Unmarshal(resBytes, &ipMinerConf)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &ipMinerConf
}

func getMinerLogs(
	client *http.Client,
	ip net.IP,
) *string {
	apiEndpoint := "/cgi-bin/log.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Println(res.Status)
		return nil
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	resString := string(resBytes)

	return &resString
}

func ContainsAny(s string, substrings []string) string {
	for _, sub := range substrings {
		if strings.Contains(s, sub) {
			return sub
		}
	}
	return ""
}

func getMinerModels() *[]MinerModel {
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

	var models []MinerModel
	err = json.Unmarshal(resBytes, &models)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &models
}

func blinkHandler(w http.ResponseWriter, r *http.Request) {
	var body []string
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(body) == 0 {
		http.Error(w, "No IP Bases Provided", http.StatusBadRequest)
		return
	}

	ips := []net.IP{}

	for _, ip := range body {
		parsedIp := net.ParseIP(ip)
		if parsedIp == nil {
			http.Error(w, "Invalid IP Provided", http.StatusBadRequest)
			return
		}
		ips = append(ips, parsedIp)
	}

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	resCh := make(chan string)

	go func() {
		wg := sync.WaitGroup{}
		concurrencyLimit := 200
		semaphore := make(chan struct{}, concurrencyLimit)

		for _, ip := range ips {
			wg.Add(1)
			semaphore <- struct{}{}
			go func(ip net.IP) {
				defer wg.Done()
				defer func() { <-semaphore }()
				apiEndpoint := "/cgi-bin/blink.cgi"
				fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

				type BlinkApiBody = struct {
					Blink bool `json:"blink"`
				}

				blink := BlinkApiBody{
					Blink: true,
				}
				marshalled, err := json.Marshal(blink)
				if err != nil {
					log.Fatalf("impossible to marshall blink: %s", err)
					resCh <- "error"
					return
				}
				res, err := client.Post(fullURL, "application/json", bytes.NewReader(marshalled))
				if err != nil {
					fmt.Println(err)
					resCh <- "error"
					return
				}
				defer res.Body.Close()

				if res.StatusCode >= 300 {
					fmt.Printf("status: %d\n", res.StatusCode)
					resCh <- "error"
					return
				}

				resCh <- "success"
			}(ip)
		}

		wg.Wait()
		close(semaphore)
		close(resCh)
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
	for r := range resCh {
		fmt.Fprintf(w, "%s\n\n", r)
		fmt.Printf("%s", r)
		flusher.Flush()
	}

}

func rebootHandler(w http.ResponseWriter, r *http.Request) {
	var body []string
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(body) == 0 {
		http.Error(w, "No IP Bases Provided", http.StatusBadRequest)
		return
	}

	ips := []net.IP{}

	for _, ip := range body {
		parsedIp := net.ParseIP(ip)
		if parsedIp == nil {
			http.Error(w, "Invalid IP Provided", http.StatusBadRequest)
			return
		}
		ips = append(ips, parsedIp)
	}

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	resCh := make(chan string)

	go func() {
		wg := sync.WaitGroup{}
		concurrencyLimit := 200
		semaphore := make(chan struct{}, concurrencyLimit)

		for _, ip := range ips {
			wg.Add(1)
			semaphore <- struct{}{}
			go func(ip net.IP) {
				defer wg.Done()
				defer func() { <-semaphore }()
				apiEndpoint := "/cgi-bin/reboot.cgi"
				fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

				res, err := client.Post(fullURL, "application/json", nil)
				if err != nil {
					fmt.Println(err)
					resCh <- "error"
					return
				}
				defer res.Body.Close()

				if res.StatusCode >= 300 {
					fmt.Printf("status: %d\n", res.StatusCode)
					resCh <- "error"
					return
				}

				resCh <- "success"
			}(ip)
		}

		wg.Wait()
		close(semaphore)
		close(resCh)
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

	// stream of reboot results
	for r := range resCh {
		fmt.Fprintf(w, "%s\n\n", r)
		fmt.Printf("%s", r)
		flusher.Flush()
	}
}

type Pool struct {
	URL  string `json:"url"`
	User string `json:"user"`
	Pass string `json:"pass"`
}

type PoolConfig struct {
	Pools []Pool `json:"pools"`
}

func poolHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		IPs   []string `json:"ips"`
		Pools []Pool   `json:"pools"`
	}
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(request.IPs) == 0 {
		http.Error(w, "No IPs Provided", http.StatusBadRequest)
		return
	}

	if len(request.Pools) == 0 {
		http.Error(w, "No Pools Provided", http.StatusBadRequest)
		return
	}

	ips := []net.IP{}

	for _, ip := range request.IPs {
		parsedIp := net.ParseIP(ip)
		if parsedIp == nil {
			http.Error(w, "Invalid IP Provided", http.StatusBadRequest)
			return
		}
		ips = append(ips, parsedIp)
	}

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	resCh := make(chan string)

	go func() {
		wg := sync.WaitGroup{}
		concurrencyLimit := 200
		semaphore := make(chan struct{}, concurrencyLimit)

		for _, ip := range ips {
			wg.Add(1)
			semaphore <- struct{}{}
			go func(ip net.IP) {
				defer wg.Done()
				defer func() { <-semaphore }()
				apiEndpoint := "/cgi-bin/set_miner_conf.cgi"
				fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

				config := PoolConfig{Pools: request.Pools}
				marshalled, err := json.Marshal(config)
				if err != nil {
					log.Fatalf("impossible to marshall config: %s", err)
					resCh <- "error"
					return
				}
				res, err := client.Post(fullURL, "application/json", bytes.NewReader(marshalled))
				if err != nil {
					fmt.Println(err)
					resCh <- "error"
					return
				}
				defer res.Body.Close()

				if res.StatusCode >= 300 {
					fmt.Printf("status: %d\n", res.StatusCode)
					resCh <- "error"
					return
				}

				resCh <- "success"
			}(ip)
		}

		wg.Wait()
		close(semaphore)
		close(resCh)
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

	// stream of results
	for r := range resCh {
		fmt.Fprintf(w, "%s\n\n", r)
		fmt.Printf("%s", r)
		flusher.Flush()
	}
}

func tcpHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Host string `json:"host"`
		Port string `json:"port"`
	}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	payload, err := json.Marshal(struct {
		Cmd string `json:"cmd"`
	}{
		Cmd: "summary"})
	if err != nil {
		log.Fatalf("impossible to marshall blink: %s", err)
		return
	}

	tcpAddr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf("%s:%s", body.Host, body.Port))

	if err != nil {
		println("ResolveTCPAddr failed:", err.Error())
		return
	}

	conn, err := net.DialTCP("tcp", nil, tcpAddr)
	if err != nil {
		println("Dial failed:", err.Error())
		return
	}

	_, err = conn.Write([]byte(payload))
	if err != nil {
		println("Write to server failed:", err.Error())
		return
	}

	println("write to server = ", payload)

	reply := make([]byte, 1024)

	_, err = conn.Read(reply)
	if err != nil {
		println("Write to server failed:", err.Error())
		return
	}

	println("reply from server=", string(reply))

	conn.Close()
	fmt.Fprintf(w, "%s", string(reply))
}

func factoryResetHandler(w http.ResponseWriter, r *http.Request) {
	var body []string
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(body) == 0 {
		http.Error(w, "No IP Bases Provided", http.StatusBadRequest)
		return
	}

	ips := []net.IP{}

	for _, ip := range body {
		parsedIp := net.ParseIP(ip)
		if parsedIp == nil {
			http.Error(w, "Invalid IP Provided", http.StatusBadRequest)
			return
		}
		ips = append(ips, parsedIp)
	}

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	resCh := make(chan string)

	go func() {
		wg := sync.WaitGroup{}
		concurrencyLimit := 200
		semaphore := make(chan struct{}, concurrencyLimit)

		for _, ip := range ips {
			wg.Add(1)
			semaphore <- struct{}{}
			go func(ip net.IP) {
				defer wg.Done()
				defer func() { <-semaphore }()
				apiEndpoint := "/cgi-bin/reset_conf.cgi"
				fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

				res, err := client.Post(fullURL, "application/json", nil)
				if err != nil {
					fmt.Println(err)
					resCh <- "error"
					return
				}
				defer res.Body.Close()

				if res.StatusCode >= 300 {
					fmt.Printf("status: %d\n", res.StatusCode)
					resCh <- "error"
					return
				}

				resCh <- "success"
			}(ip)
		}

		wg.Wait()
		close(semaphore)
		close(resCh)
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

	// stream of reboot results
	for r := range resCh {
		fmt.Fprintf(w, "%s\n\n", r)
		fmt.Printf("%s", r)
		flusher.Flush()
	}
}

func showLogHandler(w http.ResponseWriter, r *http.Request) {
	var body []string
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(body) == 0 {
		http.Error(w, "No IP Bases Provided", http.StatusBadRequest)
		return
	}

	ips := []net.IP{}

	for _, ip := range body {
		parsedIp := net.ParseIP(ip)
		if parsedIp == nil {
			http.Error(w, "Invalid IP Provided", http.StatusBadRequest)
			return
		}
		ips = append(ips, parsedIp)
	}

	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	resCh := make(chan string)

	go func() {
		wg := sync.WaitGroup{}
		concurrencyLimit := 200
		semaphore := make(chan struct{}, concurrencyLimit)

		for _, ip := range ips {
			wg.Add(1)
			semaphore <- struct{}{}
			go func(ip net.IP) {
				defer wg.Done()
				defer func() { <-semaphore }()
				apiEndpoint := "/cgi-bin/log.cgi"
				fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

				res, err := client.Get(fullURL)
				if err != nil {
					fmt.Println(err)
					resCh <- "error"
					return
				}
				defer res.Body.Close()

				if res.StatusCode >= 300 {
					fmt.Printf("status: %d\n", res.StatusCode)
					resCh <- "error"
					return
				}

				resBytes, err := io.ReadAll(res.Body)
				if err != nil {
					fmt.Println(err)
					resCh <- "error"
					return
				}

				resCh <- string(resBytes)
			}(ip)
		}

		wg.Wait()
		close(semaphore)
		close(resCh)
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

	// Stream the logs
	for r := range resCh {
		fmt.Fprintf(w, "%s\n\n", r)
		fmt.Printf("%s", r)
		flusher.Flush()
	}
}

func ipSettingsHandler(w http.ResponseWriter, r *http.Request) {
	client := &http.Client{
		Transport: &digest.Transport{
			Username: "root",
			Password: "root",
		},
		Timeout: time.Second * 5,
	}

	var request struct {
		IP string `json:"ip"`
	}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if request.IP == "" {
		http.Error(w, "IP address is required", http.StatusBadRequest)
		return
	}

	apiEndpoint := "/cgi-bin/get_network_info.cgi"
	fullURL := fmt.Sprintf("http://%s%s", request.IP, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		http.Error(w, res.Status, http.StatusInternalServerError)
		return
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var networkInfo NetworkInfo
	err = json.Unmarshal(resBytes, &networkInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(networkInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s\n\n", jsonData)
	flusher.Flush()
}
