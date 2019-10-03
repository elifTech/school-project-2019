package http

import (
	"log"
	"strings"
	"testing"
)

func TestHTTPRequest_Get(t *testing.T) {
	httpClient := Request{}

	reqHeader := ReqHeader{Key: "Content-Type", Value: "application/json"}
	body, err := httpClient.Dial().Get("https://google.com", reqHeader)
	if err != nil {
		t.Fatal(err)
	}

	log.Printf("Testing get request OK: %v \n", string(*body))
}

func TestHTTPRequest_Post(t *testing.T) {
	httpClient := Request{}

	reqHeaders := []ReqHeader{
		{Key: "Content-Type", Value: "application/json"},
	}

	body, err := httpClient.Dial().Post("https://google.com",
		strings.NewReader("I'll become a buffer"),
		reqHeaders...)

	if err != nil {
		t.Fatal(err)
	}

	log.Printf("Testing post request OK: %v \n", string(*body))
}
