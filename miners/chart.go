package miners

import (
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"

	"github.com/LucasSMPL/t0rch/utils"
)

func GetMinerChart(
	client *http.Client,
	ip net.IP,
) *utils.IpChart {
	apiEndpoint := "/cgi-bin/chart.cgi"
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

	var chartRes ChartApiRes
	err = json.Unmarshal(resBytes, &chartRes)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	io.Copy(io.Discard, res.Body)

	if len(chartRes.Rate) == 0 {
		return nil
	}

	return &utils.IpChart{
		Unit:   chartRes.Rate[0].Unit,
		Xaxis:  chartRes.Rate[0].Xaxis,
		Series: chartRes.Rate[0].Series,
	}
}

type ChartApiRes struct {
	Status struct {
		Status     string  `json:"STATUS"`
		When       float64 `json:"when"`
		Msg        string  `json:"Msg"`
		ApiVersion string  `json:"api_version"`
	} `json:"STATUS"`
	Info struct {
		MinerVersion string `json:"miner_version"`
		CompileTime  string `json:"CompileTime"`
		Type         string `json:"type"`
	} `json:"INFO"`
	Rate []struct {
		Unit   string   `json:"unit"`
		Xaxis  []string `json:"xAxis"`
		Series []struct {
			Name string    `json:"name"`
			Data []float64 `json:"data"`
		} `json:"series"`
	} `json:"RATE"`
}
