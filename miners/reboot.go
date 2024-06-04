package miners

import (
	"fmt"
	"net"
	"net/http"
)

func Reboot(
	client *http.Client,
	ip net.IP,
) error {
	apiEndpoint := "/cgi-bin/reboot.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	res, err := client.Post(fullURL, "application/json", nil)
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
