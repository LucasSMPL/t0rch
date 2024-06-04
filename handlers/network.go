package handlers

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/LucasSMPL/t0rch/miners"
	"github.com/icholy/digest"
)

func NetworkHandler(w http.ResponseWriter, r *http.Request) {
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

	networkInfo := miners.GetMinerNetworkInfo(client, ip)
	if networkInfo == nil {
		http.Error(w, "No network info found", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(networkInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, jsonData)
}
