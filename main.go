package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/icholy/digest"
)

//go:embed all:frontend/dist
var reactFS embed.FS

func main() {
	distFS, err := fs.Sub(reactFS, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}

	router := http.NewServeMux()

	router.Handle("GET /", http.FileServer(http.FS(distFS)))
	router.HandleFunc("POST /scan", scanHandler)

	server := http.Server{
		Addr:    ":7070",
		Handler: router,
	}

	log.Println("Starting HTTP server at http://localhost:7070 ...")
	log.Fatal(server.ListenAndServe())
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
		w.WriteHeader(http.StatusBadRequest)
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
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			ips = append(ips, parsedIp)
		}
	}

	resCh := make(chan *ScannedIp)

	go func() {
		scanAllIps(client, ips, resCh)
		close(resCh)
	}()

	var scannedIps []*ScannedIp
	for r := range resCh {
		if r != nil {
			scannedIps = append(scannedIps, r)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(scannedIps); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func scanAllIps(client *http.Client, ips []net.IP, resCh chan<- *ScannedIp) {
	wg := sync.WaitGroup{}
	concurrencyLimit := 200
	semaphore := make(chan struct{}, concurrencyLimit)

	for _, ip := range ips {
		wg.Add(1)
		semaphore <- struct{}{}
		go func(ip net.IP) {
			defer wg.Done()
			defer func() { <-semaphore }()
			scanRes := getMinerData(client, ip)
			resCh <- scanRes
		}(ip)
	}

	wg.Wait()
	close(semaphore)
}

func getMinerData(
	client *http.Client,
	ip net.IP,
) *ScannedIp {

	ipSummary := getMinerSummary(client, ip)
	if ipSummary == nil {
		return nil
	}

	ipStats := getMinerStats(client, ip)
	if ipStats == nil {
		return nil
	}

	fanNum := 0
	chainNum := 0
	if len(ipStats.Stats) > 0 {
		fanNum = ipStats.Stats[0].FanNum
		chainNum = ipStats.Stats[0].ChainNum
	}

	scannedIp := ScannedIp{
		Ip:             ip.String(),
		MinerType:      ipSummary.Info.Type,
		Worker:         "",
		Uptime:         0,
		Hashrate:       0,
		FanCount:       fanNum,
		HbCount:        chainNum,
		PowerType:      "",
		Controller:     "",
		IsUnderhashing: false,
		HashboardType:  "",
		PsuFailure:     false,
	}

	return &scannedIp
}

func getMinerSummary(
	client *http.Client,
	ip net.IP,
) *IpSummary {
	apiEndpoint := "/cgi-bin/summary.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Get(fullURL)
	if err != nil {
		fmt.Print(err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Print(res.Status)
		return nil
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Print(err)
		return nil
	}

	var ipSummary IpSummary
	err = json.Unmarshal(resBytes, &ipSummary)
	if err != nil {
		fmt.Print(err)
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
		fmt.Print(err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Print(res.Status)
		return nil
	}

	resBytes, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Print(err)
		return nil
	}

	var ipStats IpStats
	err = json.Unmarshal(resBytes, &ipStats)
	if err != nil {
		fmt.Print(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &ipStats
}
