// Unified API configuration for both HTTP and WebSocket connections

export const API_CONFIG = {
  // Base URL for all API connections
  BASE_URL: "https://api.wikiai.by",
  
  // WebSocket URL (derived from base URL)
  WS_URL: "wss://localhost:9001/ws",
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/login",
    TOKEN_VALIDATE: "/token/validate",
    
    // API Keys endpoints
    API_KEYS_LIST: "/api-keys/list",
    API_KEYS_CREATE: "/api-keys/create",
    API_KEYS_DELETE: "/api-keys",
    
    // Query endpoints
    QUERY: "/query",
    QUERY_WS: "/ws/query",
    
    // Files endpoints
    FILES_LIST: "/files/list",
    FILES_UPLOAD: "/upload",
    
    // Admin endpoints
    ADMIN_ACCOUNTS: "/accounts",
    ADMIN_INVITES: "/invites",
    
    // Metrics endpoints
    METRICS_SUMMARY: "/metrics/summary",
    METRICS_VOLUME: "/metrics/volume",
  }
} as const

// Helper function to get full URL for HTTP requests
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to get WebSocket URL
export function getWsUrl(endpoint: string = "/ws"): string {
  const baseUrl = API_CONFIG.BASE_URL.replace("http://", "ws://").replace("https://", "wss://")
  return `${baseUrl}${endpoint}`
}
