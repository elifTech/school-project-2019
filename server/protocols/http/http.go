package http

import (
	"io"
	"io/ioutil"
	"net/http"
	"time"
)

type Request struct {
	*http.Client
}

type ReqHeader struct {
	Key   string
	Value string
}

func (r *Request) Dial() *Request {
	tr := &http.Transport{
		MaxIdleConns:       10,
		IdleConnTimeout:    30 * time.Second,
		DisableCompression: true,
	}
	r.Client = &http.Client{Transport: tr}

	return r
}

func populateWithHeaders(req *http.Request, headers []ReqHeader) {
	if len(headers) == 0 {
		return
	}

	for _, h := range headers {
		if len(h.Key) == 0 || len(h.Value) == 0 {
			continue
		}
		req.Header.Add(h.Key, h.Value)
	}
}

func (r *Request) Get(path string, headers ...ReqHeader) (*[]byte, error) {
	var err error

	req, err := http.NewRequest("GET", path, nil)
	if err != nil {
		return nil, err
	}

	populateWithHeaders(req, headers)

	resp, err := r.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return &body, err
}

func (r *Request) Post(path string, payload io.Reader, headers ...ReqHeader) (*[]byte, error) {

	req, err := http.NewRequest("POST", path, payload)
	if err != nil {
		return nil, err
	}

	populateWithHeaders(req, headers)

	resp, err := r.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return &body, nil
}
