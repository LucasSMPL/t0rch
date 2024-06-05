package handlers

import (
	"encoding/json"
	"net"
	"net/http"
	"time"

	"github.com/LucasSMPL/t0rch/miners"
	"github.com/icholy/digest"
)

func HashboardsHandler(w http.ResponseWriter, r *http.Request) {
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

	hashboards := miners.GetHashboards(client, ip)
	if hashboards == nil {
		http.Error(w, "No hashboards data found", http.StatusInternalServerError)
		return
	}

	jsonData, err := json.Marshal(hashboards)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}
