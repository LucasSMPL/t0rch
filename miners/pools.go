package miners

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
)

func Pools(
	client *http.Client,
	ip net.IP,
	pools []struct {
		URL  string `json:"url"`
		User string `json:"user"`
		Pass string `json:"pass"`
	},
) (string, error) { // Change return type to include a message
	apiEndpoint := "/cgi-bin/set_miner_conf.cgi"
	fullURL := fmt.Sprintf("http://%s%s", ip, apiEndpoint)

	// Create the proper JSON structure with pools wrapped in an object
	config := struct {
		Pools []struct {
			URL  string `json:"url"`
			User string `json:"user"`
			Pass string `json:"pass"`
		} `json:"pools"`
	}{
		Pools: pools,
	}

	// Marshal to JSON with no indentation for single line
	marshalled, err := json.Marshal(config)
	if err != nil {
		log.Fatalf("impossible to marshall config: %s", err)
		return "", err
	}

	res, err := client.Post(fullURL, "application/json", bytes.NewReader(marshalled))
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		fmt.Printf("status: %d\n", res.StatusCode)
		return "", fmt.Errorf("status: %d", res.StatusCode)
	}

	return "Pools updated successfully", nil // Return success message
}
