all:
	cd frontend; npm install; npm run build; cd ../
	go build -o ./tmp/

run:
	cd frontend; npm install; npm run build; cd ../
	go build -o ./tmp/
	./tmp/t0rch

windows:
	cd frontend; npm install; npm run build; cd ../
	GOOS=windows GOARCH=amd64 go build -o ./tmp/

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