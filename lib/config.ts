// Unified API configuration for both HTTP and WebSocket connections
// Uses environment variables for flexible backend configuration

// Get API URL from environment variables with fallback
const getApiUrlFromEnv = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, ''); // Remove trailing slash
  }
  // Fallback to localhost for development
  return "https://api.wikiai.by";
};

// Get WebSocket URL from environment variables with fallback
const getWsUrlFromEnv = (): string => {
  const envWsUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (envWsUrl) {
    return envWsUrl.replace(/\/$/, ''); // Remove trailing slash
  }
  // Derive from API URL if not specified
  const apiUrl = getApiUrlFromEnv();
  return apiUrl.replace("http://", "ws://").replace("https://", "wss://");
};

// Get CMS prefix from environment variables
const getCmsPrefix = (): string => {
  return process.env.NEXT_PUBLIC_CMS_PREFIX || "/api/cms";
};

// Get site URL from environment variables
const getSiteUrl = (): string => {
  return process.env.NEXT_PUBLIC_SITE_URL || "";
};

// Get actual site URL (works on both server and client)
export const getActualSiteUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return getSiteUrl() || "http://localhost:3000";
};

export const API_CONFIG = {
  // Base URL for all API connections (from environment)
  BASE_URL: getApiUrlFromEnv(),
  
  // WebSocket URL (from environment or derived)
  WS_URL: getWsUrlFromEnv(),
  
  // CMS prefix (from environment)
  CMS_PREFIX: getCmsPrefix(),

  // Site URL for generating links (from environment or derived from window in client)
  SITE_URL: getSiteUrl(),
  
  // Additional configuration
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === "true",
  ENABLE_CORS_FALLBACK: process.env.NEXT_PUBLIC_ENABLE_CORS_FALLBACK !== "false",
  
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
    SEARCH: "/v1/search",
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
    
    // CMS endpoints (now unified with main API)
    ORGANIZATIONS_ALL: "/organizations/all",
    ORGANIZATIONS_PENDING: "/organizations/pending",
    ORGANIZATIONS_APPROVE: "/organizations/approve",
    ORGANIZATIONS_REJECT: "/organizations/reject",
    ORGANIZATIONS_CHANGE_STATUS: "/organizations/change-status",
    ORGANIZATIONS_SWITCH: "/organizations/switch",
    ORGANIZATIONS_MEMBERSHIPS: "/organizations/memberships",
    ORGANIZATIONS_MEMBERS: "/organizations/members",
    ORGANIZATIONS_INVITES: "/organizations/invites",
    MESSAGES_THREADS: "/messages/threads",
    MESSAGES_THREAD_MESSAGES: "/messages/threads/{threadId}/messages",
    MESSAGES_MARK_READ: "/messages/{messageId}/read",
    MESSAGES_UNREAD_COUNT: "/messages/unread-count",
  }
} as const

// Helper function to get full URL for HTTP requests
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to get WebSocket URL
export function getWsUrl(endpoint: string = "/ws"): string {
  return `${API_CONFIG.WS_URL}${endpoint}`
}

// Helper function to get CMS URL
export function getCmsUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.CMS_PREFIX}${endpoint}`
}

// Helper function to get full CMS endpoint URL
export function getCmsEndpointUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.CMS_PREFIX}${endpoint}`
}

// Debug logging (if enabled)
if (API_CONFIG.DEBUG) {
  console.log("🔧 API Configuration:", {
    BASE_URL: API_CONFIG.BASE_URL,
    WS_URL: API_CONFIG.WS_URL,
    CMS_PREFIX: API_CONFIG.CMS_PREFIX,
    TIMEOUT: API_CONFIG.TIMEOUT,
    DEBUG: API_CONFIG.DEBUG,
    ENABLE_CORS_FALLBACK: API_CONFIG.ENABLE_CORS_FALLBACK,
  });
}
