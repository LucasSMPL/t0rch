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
		fmt.Println("\033[31mError: ", err, "\033[0m")
		return err
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Printf("\033[31mStatus: %d\033[0m\n", res.StatusCode)
		return fmt.Errorf("status: %d", res.StatusCode)
	}

	fmt.Println("\033[32mSuccess: Reboot Command Sent Successfully\033[0m")
	return nil
}
