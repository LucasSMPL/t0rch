package handlers

import (
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/LucasSMPL/t0rch/miners"
	"github.com/icholy/digest"
)

func LogsHandler(w http.ResponseWriter, r *http.Request) {
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

	logs := miners.GetMinerLogs(client, ip)
	if logs == nil {
		http.Error(w, "No logs found", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "%s", *logs)
}
