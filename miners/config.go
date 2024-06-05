package miners

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"

	"github.com/LucasSMPL/t0rch/utils"
)

func GetMinerConf(
	client *http.Client,
	ip net.IP,
) *utils.IpMinerConf {
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

	var ipMinerConf utils.IpMinerConf
	err = json.Unmarshal(resBytes, &ipMinerConf)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &ipMinerConf
}

type IpConfPayload struct {
	MinerMode int `json:"miner-mode"`
	Pools     []struct {
		URL  string `json:"url"`
		User string `json:"user"`
		Pass string `json:"pass"`
	} `json:"pools"`
}

func SetMinerConf(
	client *http.Client,
	ip net.IP,
	payload IpConfPayload,
) error {
	apiEndpoint := "/cgi-bin/set_miner_conf.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	marshalled, err := json.Marshal(payload)
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
