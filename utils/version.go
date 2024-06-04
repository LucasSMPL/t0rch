package utils

import (
	"embed"
	"encoding/json"
	"log"
)

func GetVersion(configFS embed.FS) string {
	configData, err := configFS.ReadFile("config.t0rch.json")
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
