package main

import (
	"embed"
	"encoding/json"
	"log"
)

//go:embed config.t0rch.json
var embedFS embed.FS

func GetVersion() string {
	configData, err := embedFS.ReadFile("config.t0rch.json")
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	var config TorchConfig
	err = json.Unmarshal(configData, &config)
	if err != nil {
		log.Fatalf("Failed to unmarshal config data: %v", err)
	}

	return config.Version
}
