package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"sync"

	"github.com/LucasSMPL/t0rch/handlers"
	"github.com/LucasSMPL/t0rch/utils"
	"github.com/sanbornm/go-selfupdate/selfupdate"
	"github.com/skratchdot/open-golang/open"
)

//go:embed all:frontend/dist
var reactFS embed.FS

//go:embed config.t0rch.json
var configFS embed.FS

func main() {

	var version = utils.GetVersion(configFS)

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
			log.Println("-------------------Please Restart--------------------")
			os.Exit(0)
		},
	}

	go updater.BackgroundRun()

	distFS, err := fs.Sub(reactFS, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}

	router := http.NewServeMux()

	// frontend
	router.Handle("GET /", http.FileServer(http.FS(distFS)))

	// miner actions
	router.HandleFunc("POST /scan", handlers.ScanHandler)     // Find Antminers
	router.HandleFunc("POST /blink", handlers.BlinkHandler)   // Blink ON Antminer
	router.HandleFunc("POST /reboot", handlers.RebootHandler) // Reboot Antminer
	router.HandleFunc("POST /pools", handlers.PoolsHandler)   // Change Pool Antminer
	router.HandleFunc("POST /reset", handlers.ResetHandler)   // Factory Reset Antminer
	router.HandleFunc("POST /nuke", handlers.NukeHandler)     // Sleep Antminer
	router.HandleFunc("POST /wake", handlers.WakeHandler)     // Wake Up Antminer

	// miner info
	router.HandleFunc("GET /chart/{ip}/", handlers.ChartHandler)     // Hashrate Chart Antminer
	router.HandleFunc("GET /logs/{ip}/", handlers.LogsHandler)       // Show Log Antminer
	router.HandleFunc("GET /network/{ip}/", handlers.NetworkHandler) // Get Network Info Antminer

	// works in progress
	router.HandleFunc("POST /tcp", tcpHandler) // Find Whatsminer

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
