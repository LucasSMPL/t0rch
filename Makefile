GO = go
GOFLAGS = -ldflags="-s -w"
SUPPORTED_PLATFORMS = ( "darwin-amd64" "windows-386" "linux-arm" )
TARGET = t0rch

build:
	cd frontend; npm install; npm run build; cd ../
	next_version=$(cat config.t0rch.json | jq -r '.version')
	echo ${next_version}
	platforms=${{ SUPPORTED_PLATFORMS }}
	GOOS=darwin GOARCH=amd64 go build -o tmp/darwin-amd64
	~/go/bin/go-selfupdate ./tmp ${next_version}

# $(TARGET): main.go
# $(GO) build $(GOFLAGS) -o $(TARGET) main.go

# # Clean target: remove the target executable
# clean:
# rm -f $(TARGET)

# # Run target: build and run the target executable
# run: $(TARGET)
# ./$(TARGET)

# # Test target: run Go tests for the project
# test:
#  $(GO) test ./...