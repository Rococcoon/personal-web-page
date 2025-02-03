package utils

import (
  "net/http"
  "sync"
  "time"
  "log"
)

type RateLimiter struct {
  Limit     int
  Interval time.Duration
  visitors  map[string]*visitorData
  mu        sync.Mutex
}

type visitorData struct {
  lastRequest time.Time
  requests    int
}

func NewRateLimiter(limit int, interval time.Duration) *RateLimiter {
  return &RateLimiter{
    Limit: limit,
    Interval: interval,
    visitors: make(map[string]*visitorData),
  }
}

func (rl *RateLimiter) AllowRequest(r *http.Request) bool {
  // Get the visitors IP address
  ip := r.RemoteAddr

  rl.mu.Lock()
  defer rl.mu.Unlock()

  visitor, exists := rl.visitors[ip]

  if !exists {
    rl.visitors[ip] = &visitorData{
      lastRequest: time.Now(),
      requests: 1,
    }
    return true
  }

  // check if the request interval has passed
  if time.Since(visitor.lastRequest) > rl.Interval {
    // reset the request count after the interval
    visitor.requests = 1
    visitor.lastRequest = time.Now()
    return true
  }

  // if the limit is exceeded block the request
  if visitor.requests >= rl.Limit {
    log.Printf("Rate limit exceeded for IP: %s", ip)
    return false
  }

  // increment request cound and allow the request
  visitor.requests++
  return true
}
