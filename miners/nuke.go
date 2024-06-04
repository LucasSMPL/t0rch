package miners

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
)

func Nuke(
	client *http.Client,
	ip net.IP,
	sleep int,
) error {
	apiEndpoint := "/cgi-bin/set_miner_conf.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	marshalled, err := json.Marshal(struct {
		MinerMode int `json:"miner-mode"`
	}{MinerMode: sleep})
	if err != nil {
		log.Fatalf("impossible to marshall config: %s", err)
		return err
	}
	res, err := client.Post(fullURL, "application/json", bytes.NewReader(marshalled))
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Printf("status: %d\n", res.StatusCode)
		return fmt.Errorf("status: %d", res.StatusCode)
	}

	return nil
}
