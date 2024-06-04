package handlers

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/LucasSMPL/t0rch/miners"
	"github.com/icholy/digest"
)

func RebootHandler(w http.ResponseWriter, r *http.Request) {
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
				err := miners.Reboot(client, ip)
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
