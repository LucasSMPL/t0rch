package miners

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
)

func Blink(
	client *http.Client,
	ip net.IP,
) error {
	apiEndpoint := "/cgi-bin/blink.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	blink := struct {
		Blink bool `json:"blink"`
	}{
		Blink: true,
	}
	marshalled, err := json.Marshal(blink)
	if err != nil {
		log.Fatalf("impossible to marshall blink: %s", err)
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
