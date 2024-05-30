package main

import (
	"encoding/json"
	"io"
	"log"
	"os"
)

func GetVersion() string {
	configFilePath := "config.t0rch.json"

	configFile, err := os.Open(configFilePath)
	if err != nil {
		log.Fatalf("Failed to open config file: %v", err)
	}
	defer configFile.Close()

	configData, err := io.ReadAll(configFile)
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
