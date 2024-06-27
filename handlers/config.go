package handlers

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"sync"

	"github.com/LucasSMPL/t0rch/miners"
	"github.com/icholy/digest"
)

type configHandlerBody struct {
	IPs   []string `json:"ips"`
	Mode  int      `json:"mode"`
	Pools []struct {
		URL  string `json:"url"`
		User string `json:"user"`
		Pass string `json:"pass"`
	} `json:"pools,omitempty"`
}

func ConfigHandler(w http.ResponseWriter, r *http.Request) {
	var request configHandlerBody
	decoder := json.NewDecoder(r.Body)

	if err := decoder.Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(request.IPs) == 0 {
		http.Error(w, "No IPs Provided", http.StatusBadRequest)
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
		// Timeout: time.Second * 20,
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
				err := miners.SetMinerConf(
					client,
					ip,
					miners.IpConfPayload{
						MinerMode: request.Mode,
						Pools:     request.Pools,
					},
				)
				if err != nil {
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

	fmt.Fprintf(w, "%s", "success")
}