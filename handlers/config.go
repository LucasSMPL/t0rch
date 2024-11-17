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
		fmt.Println("Error decoding request:", err)
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
<<<<<<<< Updated upstream:handlers/config.go
		// Timeout: time.Second * 20,
========
>>>>>>>> Stashed changes:handlers/pools.go
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
<<<<<<<< Updated upstream:handlers/config.go
				err := miners.SetMinerConf(
					client,
					ip,
					miners.IpConfPayload{
						MinerMode: request.Mode,
						Pools:     request.Pools,
					},
				)
========
				_, err := miners.Pools(client, ip, request.Pools)
>>>>>>>> Stashed changes:handlers/pools.go
				if err != nil {
					fmt.Println("Error processing pools for IP:", ip, "Error:", err)
					resCh <- "error"
					return
				}
				resCh <- "success"
				fmt.Println("successfully changed pools for IP:", ip)
			}(ip)
		}

		wg.Wait()
		close(semaphore)
		close(resCh)
	}()

	fmt.Fprintf(w, "%s", "success")
}
