package miners

import (
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"

	"github.com/LucasSMPL/t0rch/utils"
)

func GetMinerNetworkInfo(
	client *http.Client,
	ip net.IP,
) *utils.NetworkInfo {
	apiEndpoint := "/cgi-bin/get_network_info.cgi"
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

	var networkInfo utils.NetworkInfo
	err = json.Unmarshal(resBytes, &networkInfo)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	return &networkInfo
}
