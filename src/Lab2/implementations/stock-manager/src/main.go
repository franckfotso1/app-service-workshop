package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

// These can be harcoded, there is a nginx proxy anyway
const SERVER_PORT = 8081
const SERVER_HOST = "0.0.0.0"

const daprPort = 3500
const stateStoreName = `statestore`

func updateStock(order *Order) error {
	stateUrl := fmt.Sprintf("http://localhost:%s/v1.0/state/%s", daprPort, stateStoreName)
	_ = stateUrl
	// Deduct the order from the stored stock
	// For this demo, stock is infinite so we're not doing it
	return nil
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file detected")
	}
	log.Printf("Now starting server on %s:%d\n", SERVER_HOST, SERVER_PORT)
	http.HandleFunc("/stock", func(rw http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()
		switch r.Method {
		case "POST":
		case "PATCH":
			b, err := io.ReadAll(r.Body)
			if err != nil {
				log.Println(err)
				rw.WriteHeader(http.StatusBadRequest)
				rw.Write([]byte("No body in request"))
			}
			order := Order{}
			err = json.Unmarshal(b, &order)
			if err != nil {
				log.Println(err)
				rw.WriteHeader(http.StatusBadRequest)
				rw.Write([]byte("Wrong body provided"))
			}
			err = updateStock(&order)
			rw.WriteHeader(http.StatusOK)
			rw.Write([]byte(http.StatusText(http.StatusOK)))
		default:
			return
		}

	})
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%d", SERVER_HOST, SERVER_PORT), nil))
}

type Order struct {
	Qty  int
	Type string
}

// Internal function used to handle 500 Errors
func handleServerError(err error, w http.ResponseWriter) {
	log.Println(err.Error())
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("Unexpected error\n"))
}
