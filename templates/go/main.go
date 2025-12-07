package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
)

// Config holds application configuration
type Config struct {
	Port        string
	Environment string
	Project     string
	Org         string
}

// HealthResponse represents health check response
type HealthResponse struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

// InfoResponse represents root endpoint response
type InfoResponse struct {
	Message string `json:"message"`
	Org     string `json:"org"`
	Env     string `json:"env"`
	Project string `json:"project"`
}

// ReadyResponse represents readiness probe response
type ReadyResponse struct {
	Status string `json:"status"`
}

var config Config

func init() {
	config = Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("ENVIRONMENT", "{{ENV}}"),
		Project:     "{{PROJECT}}",
		Org:         "{{ORG}}",
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// loggingMiddleware logs request details
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

// jsonResponse writes JSON response
func jsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	jsonResponse(w, InfoResponse{
		Message: "Welcome to " + config.Project,
		Org:     config.Org,
		Env:     config.Environment,
		Project: config.Project,
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, HealthResponse{
		Status:      "healthy",
		Environment: config.Environment,
		Version:     "1.0.0",
	})
}

func readyHandler(w http.ResponseWriter, r *http.Request) {
	// Add your readiness checks here (database connection, etc.)
	jsonResponse(w, ReadyResponse{Status: "ready"})
}

// NewRouter creates and configures the HTTP router
func NewRouter() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", rootHandler)
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/ready", readyHandler)
	return loggingMiddleware(mux)
}

func main() {
	router := NewRouter()

	log.Printf("%s starting on port %s in %s mode", config.Project, config.Port, config.Environment)
	if err := http.ListenAndServe(":"+config.Port, router); err != nil {
		log.Fatal(err)
	}
}
