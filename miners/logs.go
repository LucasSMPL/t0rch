package miners

import (
	"fmt"
	"io"
	"net"
	"net/http"
)

func GetMinerLogs(
	client *http.Client,
	ip net.IP,
) *string {
	apiEndpoint := "/cgi-bin/log.cgi"
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

	io.Copy(io.Discard, res.Body)

	resString := string(resBytes)

	return &resString
}
