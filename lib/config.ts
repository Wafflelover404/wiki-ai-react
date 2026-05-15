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

// Go-core v1 prefix
const V1_PREFIX = "/v1"

// Get CMS prefix (go-core uses /v1/cms instead of old /api/cms)
const getCmsPrefix = (): string => {
  return process.env.NEXT_PUBLIC_CMS_PREFIX || "/v1/cms";
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
  
  // API version prefix
  V1_PREFIX: V1_PREFIX,

  // Go-core endpoint paths (all under /v1/)
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: `${V1_PREFIX}/auth/login`,
    LOGOUT: `${V1_PREFIX}/auth/logout`,
    REFRESH: `${V1_PREFIX}/auth/refresh`,
    ME: `${V1_PREFIX}/me`,
    PERMISSIONS: `${V1_PREFIX}/permissions`,

    // API Keys endpoints
    API_KEYS: `${V1_PREFIX}/api-keys`,

    // Query endpoints
    QUERY: `${V1_PREFIX}/search`,
    QUERY_STREAM: `${V1_PREFIX}/search`,
    QUERY_BATCH_OVERVIEWS: `${V1_PREFIX}/search`,

    // Search endpoint
    SEARCH: `${V1_PREFIX}/search`,

    // Files endpoints
    FILES: `${V1_PREFIX}/files`,

    // Organizations endpoints
    ORGANIZATIONS: `${V1_PREFIX}/organizations`,
    ORGANIZATIONS_PENDING: `${V1_PREFIX}/organizations/pending`,
    ORGANIZATIONS_STATUS_BY_EMAIL: `${V1_PREFIX}/organizations/status-by-email`,

    // Invites endpoints
    INVITES: `${V1_PREFIX}/invites`,

    // Messages endpoints
    MESSAGES_THREADS: `${V1_PREFIX}/messages/threads`,
    MESSAGES_UNREAD_COUNT: `${V1_PREFIX}/messages/unread-count`,

    // Dashboard endpoints
    DASHBOARD_EMPLOYEE: `${V1_PREFIX}/dashboard/employee`,
    DASHBOARD_ADMIN: `${V1_PREFIX}/dashboard/admin`,

    // Metrics endpoints
    METRICS_SUMMARY: `${V1_PREFIX}/metrics/summary`,
    METRICS_QUERIES: `${V1_PREFIX}/metrics/queries`,
    METRICS_VOLUME: `${V1_PREFIX}/metrics/volume`,

    // Catalogs endpoints
    CATALOGS: `${V1_PREFIX}/catalogs`,

    // Plugins endpoints
    PLUGINS: `${V1_PREFIX}/plugins`,
    PLUGINS_TOKENS: `${V1_PREFIX}/plugins/tokens`,

    // OpenCart endpoints
    OPENCART_PRODUCTS_IMPORT: `${V1_PREFIX}/opencart/products/import`,

    // Learning / Quiz endpoints
    ADMIN_QUIZZES: `${V1_PREFIX}/admin/quizzes`,
    USER_QUIZZES: `${V1_PREFIX}/quizzes`,
    REPORTS: `${V1_PREFIX}/reports`,

    // CMS endpoints (go-core)
    CMS_BLOG_POSTS: `${V1_PREFIX}/cms/blog/posts`,
    CMS_BLOG_CATEGORIES: `${V1_PREFIX}/cms/blog/categories`,
    CMS_BLOG_SUBSCRIBE: `${V1_PREFIX}/cms/blog/subscribe`,
    CMS_CONTACT_SUBMIT: `${V1_PREFIX}/cms/contact/submit`,
    CMS_SALES_DEMO: `${V1_PREFIX}/cms/sales/demo-request`,
    CMS_SALES_QUOTE: `${V1_PREFIX}/cms/sales/quote-request`,
    CMS_STATUS_SERVICES: `${V1_PREFIX}/cms/status/services`,
    CMS_STATUS_OVERVIEW: `${V1_PREFIX}/cms/status/overview`,
    CMS_HELP_ARTICLES: `${V1_PREFIX}/cms/help/articles`,
    CMS_HELP_CATEGORIES: `${V1_PREFIX}/cms/help/categories`,
    CMS_DOCS: `${V1_PREFIX}/cms/docs`,
    CMS_DOCS_CATEGORIES: `${V1_PREFIX}/cms/docs/categories`,
    CMS_ANALYTICS_TRACK_VISIT: `${V1_PREFIX}/cms/analytics/track-visit`,
    CMS_ANALYTICS_TRACK_EVENT: `${V1_PREFIX}/cms/analytics/track-event`,
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

// Helper function to get /v1/ prefixed URL
export function getV1Url(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${V1_PREFIX}${endpoint}`
}

// Helper function to get CMS URL (go-core: /v1/cms/...)
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
