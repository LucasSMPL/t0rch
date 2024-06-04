package miners

import (
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"

	"github.com/LucasSMPL/t0rch/utils"
)

func GetMinerSummary(
	client *http.Client,
	ip net.IP,
) *utils.IpSummary {
	apiEndpoint := "/cgi-bin/summary.cgi"
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

	var ipSummary utils.IpSummary
	err = json.Unmarshal(resBytes, &ipSummary)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &ipSummary
}
