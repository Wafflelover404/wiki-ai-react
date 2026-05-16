import { API_CONFIG, getApiUrl, getV1Url, getCmsEndpointUrl } from "./config"

interface ApiRequestOptions {
  url: string
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  token?: string
  data?: Record<string, unknown> | FormData
  params?: Record<string, string>
}

interface ApiResponse<T = unknown> {
  status: "success" | "error"
  message?: string
  response?: T
}

interface LoginResponse {
  status: "success" | "error"
  message: string
  token?: string
  role?: "user" | "admin" | "owner"
  access_token?: string
  refresh_token?: string
  user?: { id: string; username: string; email?: string }
  organization?: { id: string; name: string; slug: string; status: string }
}

async function apiRequest<T = unknown>({
  url,
  method = "GET",
  token,
  data,
  params,
}: ApiRequestOptions): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    
  }

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  let fullUrl: string
  if (url.startsWith("http://") || url.startsWith("https://")) {
    fullUrl = url
  } else if (url.startsWith("/v1/")) {
    fullUrl = getApiUrl(url)
  } else {
    fullUrl = getApiUrl(url)
  }

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString()
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + query
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    })

    // Handle 204 No Content (e.g., DELETE success)
    if (response.status === 204) {
      return { status: "success" as const, response: undefined as T }
    }

    let result
    try {
      result = await response.json()
    } catch {
      result = { detail: `Invalid JSON response: ${response.status} ${response.statusText}` }
    }

    if (!response.ok) {
      // Go-core error format: {"error": {"code": "...", "message": "..."}}
      if (result?.error?.message) {
        return { status: "error", message: result.error.message }
      }
      // Old FastAPI error format: {"detail": "..."}
      let errorMessage = "Request failed"
      if (result.detail) {
        errorMessage = typeof result.detail === "string" ? result.detail : JSON.stringify(result.detail)
      } else if (result.message) {
        errorMessage = result.message
      }
      return { status: "error", message: errorMessage }
    }

    // Go-core wraps errors but not successes - detect format
    // If result looks like old core format ({status, response}), pass through
    if (result && typeof result === "object" && !Array.isArray(result)) {
      if (result.status === "success" || result.status === "error") {
        return result as ApiResponse<T>
      }
    }

    // Go-core success - wrap it
    return { status: "success", response: result as T }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
    }
  }
}

// ──────────────────────────────────────────────
// AUTH ENDPOINTS
// ──────────────────────────────────────────────
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      
    }

    try {
      const response = await fetch(getV1Url("/auth/login"), {
        method: "POST",
        headers,
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        const msg = result?.error?.message || result?.message || result?.detail || "Invalid credentials"
        return { status: "error", message: msg }
      }

      // Transform go-core LoginResponse to frontend format
      return {
        status: "success",
        message: "Login successful",
        token: result.access_token,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        role: result.user?.role || result.memberships?.[0]?.role || "user",
        user: result.user,
        organization: result.organization,
      }
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Network error",
      }
    }
  },

  // GET /v1/me replaces /token/validate - returns user info from JWT claims
  validateToken: (token: string) =>
    apiRequest<{
      valid: boolean
      username: string
      role: string
      organization?: string
      organization_id?: string
      organization_name?: string
    }>({
      url: API_CONFIG.ENDPOINTS.ME,
      token,
    }).then(res => {
      // Transform go-core /v1/me response to old /token/validate format
      if (res.status === "success" && res.response) {
        const me = res.response as any
        return {
          status: "success" as const,
          response: {
            valid: true,
            username: me.user?.username || "",
            role: me.user?.role || "",
            organization: me.organization?.id || "",
            organization_id: me.organization?.id || "",
            organization_name: me.organization?.name || "",
          },
        }
      }
      return { status: "error" as const, message: res.message || "Token validation failed" }
    }),

  // GET /v1/me returns role in user object - derive admin access from it
  checkAdminAccess: (token: string) =>
    apiRequest<{ admin: boolean }>({
      url: API_CONFIG.ENDPOINTS.ME,
      token,
    }).then(res => {
      if (res.status === "success" && res.response) {
        const me = res.response as any
        const isAdmin = me.user?.role === "admin" || me.user?.role === "owner" ||
          (me.permissions || []).includes("admin")
        return { status: "success" as const, response: { admin: isAdmin } }
      }
      return { status: "error" as const, message: res.message || "Access check failed" }
    }),

  // POST /v1/organizations - creates org + returns login response
  createOrganization: (data: {
    organization_name: string
    admin_username: string
    admin_password: string
    admin_email?: string
  }) =>
    apiRequest({
      url: API_CONFIG.ENDPOINTS.ORGANIZATIONS,
      method: "POST",
      data,
    }),

  // POST /organizations/switch - NOT IN GO-CORE (JWT already scoped to org)
  switchOrganization: (_token: string, _data: {
    organization_id?: string
    organization_slug?: string
  }) =>
    Promise.resolve({
      status: "error" as const,
      message: "Organization switching is not available in the current API version. Please re-authenticate.",
    }),

  // GET /organizations/memberships - NOT IN GO-CORE (login returns memberships)
  listMemberships: (_token: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "Membership listing is not available as a separate endpoint. Login response includes memberships.",
    }),

  // GET /organizations/members - NOT IN GO-CORE
  listMembers: (_token: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "Member listing is not available in the current API version.",
    }),

  // POST /v1/invites (was /organizations/invites)
  createInvite: (token: string, email: string, role = "member") =>
    apiRequest({
      url: API_CONFIG.ENDPOINTS.INVITES,
      method: "POST",
      token,
      data: { email, role },
    }),

  // POST /v1/invites/accept
  acceptInvite: (inviteToken: string, password: string, username: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/accept`,
      method: "POST",
      data: { token: inviteToken, username, password },
    }),

  // POST /organizations/members/role - NOT IN GO-CORE
  updateMemberRole: (_token: string, _userId: string, _role: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "Member role update is not available in the current API version.",
    }),

  // DELETE /v1/invites/{id} (was /organizations/invites/{id})
  revokeInvite: (token: string, inviteId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/${encodeURIComponent(inviteId)}`,
      method: "DELETE",
      token,
    }),
}

// ──────────────────────────────────────────────
// FILES ENDPOINTS
// ──────────────────────────────────────────────
// Helper: list all files then find UUID by filename
async function resolveFileId(token: string, filename: string): Promise<string | null> {
  const res = await filesApi.list(token)
  if (res.status === "success" && res.response?.documents) {
    const file = res.response.documents.find(d => d.filename === filename)
    return file?.id || null
  }
  return null
}

export const filesApi = {
  // GET /v1/files - returns {items: [FileRecord, ...], next_cursor}
  list: async (token: string) => {
    const res = await apiRequest<{
      items: Array<{
        id: string
        organization_id: string
        filename: string
        content_type: string
        size_bytes: number
        status: string
        uploaded_by: string
        metadata: Record<string, unknown>
        created_at: string
        updated_at: string
      }>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.FILES,
      token,
    })

    // Transform go-core FileRecord format to old {documents: [...]} format
    if (res.status === "success" && res.response) {
      const data = res.response as any
      const items = data.items || []
      return {
        status: "success" as const,
        response: {
          documents: items.map((f: any) => ({
            id: f.id,
            filename: f.filename,
            upload_timestamp: f.created_at,
            organization_id: f.organization_id,
            file_size: f.size_bytes,
          })),
        },
      }
    }
    return res
  },

  // GET /v1/files/{id}/content (by UUID, not filename)
  getContent: async (token: string, filename: string) => {
    const fileId = await resolveFileId(token, filename)
    if (!fileId) {
      return {
        status: "error" as const,
        message: `File "${filename}" not found`,
      }
    }

    const headers: Record<string, string> = {
      
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILES}/${encodeURIComponent(fileId)}/content`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      return {
        status: "error" as const,
        message: `Failed to fetch file content: ${response.status}`,
      }
    }

    const contentType = response.headers.get("content-type")
    const isJsonResponse = contentType && contentType.includes("application/json")

    if (isJsonResponse) {
      const data = await response.json()
      return {
        status: "success" as const,
        response: {
          content: data.content || "",
          isBinary: data.isBinary || false,
        },
      }
    }

    const isBinary = contentType && (
      contentType.includes("application/pdf") ||
      contentType.includes("application/msword") ||
      contentType.includes("application/vnd.openxmlformats-officedocument") ||
      contentType.includes("application/octet-stream")
    )

    if (isBinary) {
      const blob = await response.blob()
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
      const base64Content = base64.split(",")[1]
      return {
        status: "success" as const,
        response: { content: base64Content, isBinary: true },
      }
    }

    const content = await response.text()
    return {
      status: "success" as const,
      response: { content, isBinary: false },
    }
  },

  // POST /v1/files - multipart file upload
  upload: async (token: string, files: File[]) => {
    const tenantId = await resolveTenantId(token)
    const results = []
    for (const file of files) {
      const content = await file.text()
      const res = await apiRequest({
        url: `${API_CONFIG.V1_PREFIX}/documents`,
        method: "POST",
        token,
        data: {
          tenant_id: tenantId,
          title: file.name,
          source_url: "core:upload:" + file.name,
          content,
          doc_type: file.name.split('.').pop() || "txt",
        },
      })
      if (res.status === "success") results.push(res.response)
    }
    return { status: "success" as const, response: { items: results } }
  },

  // POST /files/edit - NOT IN GO-CORE
  edit: (_token: string, _filename: string, _newContent: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "File editing is not available in the current API version.",
    }),

  // DELETE /v1/files/{id}
  deleteById: (token: string, fileId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.FILES}/${encodeURIComponent(fileId)}`,
      method: "DELETE",
      token,
    }),

  // DELETE by filename - resolve UUID first, then delete
  deleteByFilename: async (token: string, filename: string) => {
    const fileId = await resolveFileId(token, filename)
    if (!fileId) {
      return { status: "error" as const, message: `File "${filename}" not found` }
    }
    return filesApi.deleteById(token, fileId)
  },

  // POST /v1/files/{id}/reindex
  index: async (token: string) => {
    // Go-core requires a file ID; list all and reindex each
    const listRes = await filesApi.list(token)
    if (listRes.status !== "success" || !listRes.response?.documents?.length) {
      return { status: "error" as const, message: "No files to reindex" }
    }
    const results = await Promise.allSettled(
      listRes.response.documents.map(doc =>
        apiRequest({
          url: `${API_CONFIG.ENDPOINTS.FILES}/${encodeURIComponent(doc.id)}/reindex`,
          method: "POST",
          token,
          data: {},
        })
      )
    )
    const succeeded = results.filter(r => r.status === "fulfilled").length
    return {
      status: "success" as const,
      response: { reindexed: succeeded, total: listRes.response.documents.length },
    }
  },
}

// ──────────────────────────────────────────────
// QUERY ENDPOINTS
// ──────────────────────────────────────────────
// Resolve tenant_id (org UUID) from JWT via /v1/me
async function resolveTenantId(token: string): Promise<string | null> {
  try {
    const res = await authApi.validateToken(token)
    if (res.status === "success" && res.response) {
      return (res.response as any).organization_id || null
    }
  } catch { /* ignore */ }
  return null
}

function synthesizeAnswer(question: string, chunks: any[]): string {
  if (!chunks || chunks.length === 0) {
    return "No relevant knowledge base content was found for: " + question
  }
  const top = chunks[0].content || ""
  return top.length > 500 ? top.substring(0, 500) : top
}

function chunksToSearchResults(chunks: any[]): any[] {
  return chunks.map((c: any) => ({
    chunk_id: c.chunk_id,
    document_id: c.document_id,
    content: c.content,
    final_score: c.final_score,
    source: c.source || c.metadata?.filename || "memory",
    metadata: c.metadata,
  }))
}

export const queryApi = {
  // POST /v1/search (external KMS) - the query endpoint
  query: async (token: string, question: string, options?: {
    session_id?: string
    model?: string
    humanize?: boolean
    ai_agent_mode?: boolean
    top_k?: number
  }) => {
    const tenantId = await resolveTenantId(token)
    const res = await apiRequest<{
      results: Array<{
        chunk_id: string
        document_id: string
        content: string
        final_score: number
        source: string
        metadata?: Record<string, unknown>
      }>
      query_id: string
      took_ms: number
    }>({
      url: API_CONFIG.ENDPOINTS.SEARCH,
      method: "POST",
      token,
      data: {
        tenant_id: tenantId,
        query: question,
        top_k: options?.top_k || 10,
      },
    })

    if (res.status === "success" && res.response) {
      const data = res.response as any
      const chunks = data.results || []
      return {
        status: "success" as const,
        response: {
          answer: synthesizeAnswer(question, chunks),
          chunks: chunksToSearchResults(chunks),
          model: options?.model || null,
          query_id: data.query_id,
          took_ms: data.took_ms,
          security: { organization_id: tenantId, filtered: true },
        },
      }
    }
    return res
  },

  // KMS search (synchronous - no streaming) - fires synthetic events for backward compat
  queryStream: async (
    token: string,
    question: string,
    options?: {
      session_id?: string
      model?: string
      humanize?: boolean
      top_k?: number
      onMessage?: (message: any) => void
    }
  ): Promise<ApiResponse<any>> => {
    if (options?.onMessage) {
      options.onMessage({ type: "status", data: { message: "searching" } })
    }

    const result = await queryApi.query(token, question, options)
    if (result.status !== "success") {
      if (options?.onMessage) {
        options.onMessage({ type: "error", data: { message: result.message } })
      }
      return result
    }

    const data = result.response!
    if (options?.onMessage) {
      options.onMessage({ type: "chunks", data: { chunks: data.chunks } })
      options.onMessage({ type: "answer", data: { answer: data.answer } })
      options.onMessage({ type: "complete", data: { query_id: data.query_id } })
    }

    return { status: "success", response: data }
  },

  // Legacy WebSocket wrapper - delegates to KMS search
  queryWebSocket: async (
    token: string,
    question: string,
    options?: {
      session_id?: string
      model?: string
      humanize?: boolean
      ai_agent_mode?: boolean
      onMessage?: (message: any) => void
    }
  ) => {
    return queryApi.queryStream(token, question, {
      ...options,
      onMessage: (msg) => {
        if (options?.onMessage) {
          options.onMessage({
            type: msg.type,
            data: msg.type === "chunks" ? msg.data : msg.data,
            message: msg.type === "status" ? msg.data?.message : undefined,
          })
        }
      },
    })
  },
}

// ──────────────────────────────────────────────
// REPORTS ENDPOINTS
// ──────────────────────────────────────────────
// Go-core learning service has generic reports (no auto/manual distinction)
export const reportsApi = {
  getAuto: async (token: string) => {
    const res = await apiRequest<{ items: Array<Record<string, unknown>>; next_cursor: string | null }>({
      url: API_CONFIG.ENDPOINTS.REPORTS,
      token,
      params: { type: "auto" },
    })
    if (res.status === "success" && res.response) {
      const data = res.response as any
      return {
        status: "success" as const,
        response: { reports: data.items || [] },
      }
    }
    return res
  },

  getManual: async (token: string) => {
    const res = await apiRequest<{ items: Array<Record<string, unknown>>; next_cursor: string | null }>({
      url: API_CONFIG.ENDPOINTS.REPORTS,
      token,
      params: { type: "manual" },
    })
    if (res.status === "success" && res.response) {
      const data = res.response as any
      return {
        status: "success" as const,
        response: { reports: data.items || [] },
      }
    }
    return res
  },

  submitManual: (token: string, issue: string) =>
    apiRequest({
      url: API_CONFIG.ENDPOINTS.REPORTS,
      method: "POST",
      token,
      data: { type: "manual", issue },
    }),
}

// ──────────────────────────────────────────────
// ADMIN ENDPOINTS (feature gaps marked)
// ──────────────────────────────────────────────
export const adminApi = {
  // GET /accounts - NOT IN GO-CORE
  listAccounts: async (_token: string) => {
    return {
      status: "error" as const,
      message: "Account listing is not available in the current API version.",
    }
  },

  // POST /register - NOT IN GO-CORE
  createUser: (
    _token: string,
    _userData: { username: string; password: string; role: string; allowed_files?: string[] },
  ) =>
    Promise.resolve({
      status: "error" as const,
      message: "User registration is not available in the current API version.",
    }),

  // POST /user/edit - NOT IN GO-CORE
  editUser: (
    _token: string,
    _userData: { username: string; role?: string; password?: string; allowed_files?: string[] },
  ) =>
    Promise.resolve({
      status: "error" as const,
      message: "User editing is not available in the current API version.",
    }),

  // DELETE /user/delete - NOT IN GO-CORE
  deleteUser: (_token: string, _username: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "User deletion is not available in the current API version.",
    }),

  // POST /v1/invites
  createInvite: (
    token: string,
    inviteData: {
      email?: string
      role: string
      allowed_files?: string[]
      expires_in_days?: number
      message?: string
    }
  ) =>
    apiRequest<{
      invite: {
        id: string
        organization_id: string
        email?: string
        role: string
        message?: string
        expires_at: string
        created_by: string
        created_at: string
      }
      token: string
      link: string
    }>({
      url: API_CONFIG.ENDPOINTS.INVITES,
      method: "POST",
      token,
      data: inviteData,
    }),

  // GET /v1/invites (was /invites)
  listInvites: (token: string) =>
    apiRequest<{ items: Array<Record<string, unknown>>; next_cursor: string | null }>({
      url: API_CONFIG.ENDPOINTS.INVITES,
      token,
    }),

  // GET /v1/invites/{token} (was /invite/{token})
  getInviteInfo: (inviteToken: string) =>
    apiRequest<{
      valid: boolean
      invite: {
        id: string
        email?: string
        role: string
        message?: string
        expires_at: string
        created_by: string
        created_at: string
      }
    }>({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/${encodeURIComponent(inviteToken)}`,
    }),

  // POST /v1/invites/accept
  acceptInvite: (
    token: string,
    userData: { username: string; password: string }
  ) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/accept`,
      method: "POST",
      data: { ...userData, token },
    }),

  // DELETE /v1/invites/{inviteId}
  revokeInvite: (token: string, inviteId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/${encodeURIComponent(inviteId)}`,
      method: "DELETE",
      token,
    }),

  // GET /v1/organizations/status-by-email/{email}
  getOrganizationStatusByEmail: (email: string) =>
    apiRequest<{
      known: boolean
    }>({
      url: `${API_CONFIG.ENDPOINTS.ORGANIZATIONS_STATUS_BY_EMAIL}/${encodeURIComponent(email)}`,
    }),
}

// ──────────────────────────────────────────────
// CATALOGS ENDPOINTS
// ──────────────────────────────────────────────
export const catalogsApi = {
  list: (token: string) =>
    apiRequest<{
      items: Array<{
        id: string
        name: string
        shop_name?: string
        description?: string
        total_products: number
        indexed_products: number
        active: boolean
        created_at: string
      }>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.CATALOGS,
      token,
    }),

  create: (token: string, name: string, shopName?: string, description?: string) =>
    apiRequest({
      url: API_CONFIG.ENDPOINTS.CATALOGS,
      method: "POST",
      token,
      data: { name, shop_name: shopName || name, description },
    }),

  search: (token: string, catalogId: string, query: string) =>
    apiRequest<{
      products: Array<{
        id: string
        name: string
        description: string
        price: number
        special_price?: number
        image?: string
        url?: string
        quantity?: number
        shop_name?: string
        score?: number
      }>
    }>({
      url: `${API_CONFIG.ENDPOINTS.CATALOGS}/${encodeURIComponent(catalogId)}/search`,
      token,
      params: { query },
    }),

  delete: (token: string, catalogId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.CATALOGS}/${encodeURIComponent(catalogId)}`,
      method: "DELETE",
      token,
    }),
}

// ──────────────────────────────────────────────
// PLUGINS ENDPOINTS
// ──────────────────────────────────────────────
export const pluginsApi = {
  // GET /v1/plugins (was /plugins/status)
  status: (token: string) =>
    apiRequest<{
      items: Array<{
        id: string
        plugin_key: string
        enabled: boolean
        config?: Record<string, unknown>
        updated_at: string
      }>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.PLUGINS,
      token,
    }),

  // PATCH /v1/plugins/{plugin} with {enabled: true/false}
  enable: (token: string, plugin = "opencart") =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.PLUGINS}/${encodeURIComponent(plugin)}`,
      method: "PATCH",
      token,
      data: { enabled: true },
    }),

  disable: (token: string, plugin = "opencart") =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.PLUGINS}/${encodeURIComponent(plugin)}`,
      method: "PATCH",
      token,
      data: { enabled: false },
    }),

  listTokens: (token: string) =>
    apiRequest<{
      items: Array<{
        id: string
        plugin_key: string
        name: string
        token_prefix: string
        created_at: string
        revoked_at?: string
      }>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.PLUGINS_TOKENS,
      token,
    }),

  // POST /v1/plugins/tokens (was /plugins/tokens/create)
  createToken: (token: string, name: string, pluginKey = "opencart") =>
    apiRequest<{
      token: string
      plugin_token: {
        id: string
        name: string
        plugin_key: string
        created_at: string
      }
    }>({
      url: API_CONFIG.ENDPOINTS.PLUGINS_TOKENS,
      method: "POST",
      token,
      data: { plugin_key: pluginKey, name },
    }),

  deleteToken: (token: string, tokenId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.PLUGINS_TOKENS}/${encodeURIComponent(tokenId)}`,
      method: "DELETE",
      token,
    }),
}

// ──────────────────────────────────────────────
// OPENCART ENDPOINTS
// ──────────────────────────────────────────────
export const opencartApi = {
  // POST /v1/opencart/products/import
  importProducts: (token: string, catalogId: string, products?: Array<Record<string, unknown>>) =>
    apiRequest({
      url: API_CONFIG.ENDPOINTS.OPENCART_PRODUCTS_IMPORT,
      method: "POST",
      token,
      data: { catalog_id: catalogId, products: products || [] },
    }),
}

// ──────────────────────────────────────────────
// API KEYS ENDPOINTS
// ──────────────────────────────────────────────
// Go-core only supports: list, create, revoke (no quota/usage/audit/llm-control)
export const apiKeysApi = {
  list: (token: string) =>
    apiRequest<{
      items: Array<{
        id: string
        name: string
        key_prefix: string
        description?: string
        permissions: string[]
        status: string
        is_active?: boolean
        created_at: string
        last_used_at?: string
        expires_at?: string
        rate_limit_requests: number
        rate_limit_period: string
        llm_enabled: boolean
        max_tokens_per_day: number
        llm_cost_limit: number
      }>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.API_KEYS,
      token,
    }),

  create: (token: string, data: {
    name: string
    description?: string
    permissions: string[]
    expires_in_days?: number
  }) =>
    apiRequest<{
      api_key: {
        id: string
        name: string
        key_prefix: string
        permissions: string[]
        status: string
        created_at: string
      }
      full_key: string
    }>({
      url: API_CONFIG.ENDPOINTS.API_KEYS,
      method: "POST",
      token,
      data,
    }),

  // DELETE /v1/api-keys/{keyId} - NOT IN GO-CORE (only revoke is available)
  delete: (_token: string, _keyId: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key deletion is not available. Use revoke instead.",
    }),

  // GET /v1/api-keys/{keyId} - NOT IN GO-CORE
  get: (_token: string, _keyId: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "Individual API key details are not available in the current API version.",
    }),

  // PUT /v1/api-keys/{keyId} - NOT IN GO-CORE
  update: (_token: string, _keyId: string, _data: Record<string, unknown>) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key updates are not available in the current API version.",
    }),

  // POST /v1/api-keys/{keyId}/revoke
  revoke: (token: string, keyId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.API_KEYS}/${encodeURIComponent(keyId)}/revoke`,
      method: "POST",
      token,
    }),

  // NOT IN GO-CORE
  getQuota: (_token: string, _keyId: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key quota is not available in the current API version.",
    }),

  getUsageStats: (_token: string, _keyId: string, _days?: number) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key usage stats are not available in the current API version.",
    }),

  getAuditLog: (_token: string, _keyId: string, _limit?: number, _offset?: number) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key audit log is not available in the current API version.",
    }),

  getLlmControl: (_token: string, _keyId: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key LLM control is not available in the current API version.",
    }),

  updateLlmControl: (_token: string, _keyId: string, _data: Record<string, unknown>) =>
    Promise.resolve({
      status: "error" as const,
      message: "API key LLM control is not available in the current API version.",
    }),

  // GET /v1/permissions (was /api-keys/permissions/list)
  getPermissions: (token: string) =>
    apiRequest<Record<string, string>>({
      url: API_CONFIG.ENDPOINTS.PERMISSIONS,
      token,
    }),
}

// ──────────────────────────────────────────────
// METRICS ENDPOINTS
// ──────────────────────────────────────────────
export const metricsApi = {
  summary: (token: string, since: string = "24h", scope: "user" | "org" | "global" = "org") =>
    apiRequest<{
      total_queries: number
      successful_queries: number
      failed_queries: number
      avg_response_time_ms: number
      unique_users: number
    }>({
      url: API_CONFIG.ENDPOINTS.METRICS_SUMMARY,
      token,
      params: { period: since, scope },
    }),

  queries: (
    token: string,
    limit?: number,
    since: string = "24h",
    scope: "user" | "org" | "global" = "org",
    offset: number = 0,
  ) =>
    apiRequest<{
      items: Array<Record<string, unknown>>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.METRICS_QUERIES,
      token,
      params: {
        period: since,
        scope,
        ...(typeof limit === "number" ? { limit: String(limit) } : {}),
        offset: String(offset),
      },
    }),

  volume: (
    token: string,
    days: number = 7,
    scope: "user" | "org" | "global" = "org",
  ) =>
    apiRequest<{
      period: string
      total_queries: number
      data: Array<{
        date: string
        queries: number
        success: number
        failed: number
        avgResponseTime: number
        uniqueUsers: number
      }>
    }>({
      url: API_CONFIG.ENDPOINTS.METRICS_VOLUME,
      token,
      params: { days: String(days), scope },
    }),
}

// ──────────────────────────────────────────────
// AI AGENT ENDPOINTS - NOT IN GO-CORE
// ──────────────────────────────────────────────
export const aiAgentApi = {
  executeCommands: async (_token: string, _input: string) => ({
    status: "error" as const,
    message: "AI agent execution is not available in the current API version.",
  }),

  getAvailableFiles: (_token: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "AI agent file listing is not available in the current API version.",
    }),

  fileContent: (_token: string, _filename: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "AI agent file content is not available in the current API version.",
    }),

  fileById: (_token: string, _fileId: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "AI agent file-by-ID is not available in the current API version.",
    }),

  fuzzySearch: (_token: string, _query: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "AI agent fuzzy search is not available in the current API version.",
    }),

  kbSearch: (_token: string, _query: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "AI agent KB search is not available in the current API version.",
    }),

  semanticSearch: (_token: string, _query: string) =>
    Promise.resolve({
      status: "error" as const,
      message: "AI agent semantic search is not available in the current API version. Use queryApi instead.",
    }),

  batchOverviews: (token: string, queries: string[], results: unknown[]) =>
    apiRequest<{ overviews: string[] }>({
      url: API_CONFIG.ENDPOINTS.QUERY_BATCH_OVERVIEWS,
      method: "POST",
      token,
      data: { queries, results },
    }),
}

// ──────────────────────────────────────────────
// CMS / LANDING PAGES ENDPOINTS (go-core: /v1/cms/...)
// ──────────────────────────────────────────────
export const landingPagesApi = {
  getBlogPosts: async (params?: {
    category?: string
    featured?: boolean
    limit?: number
    offset?: number
    search?: string
  }) => {
    const headers: Record<string, string> = {
      
      "Content-Type": "application/json",
    }

    let url = getCmsEndpointUrl("/blog/posts")

    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append("search", params.search)
      if (params.category) queryParams.append("category", params.category)
      if (params.featured) queryParams.append("featured", params.featured.toString())
      if (params.limit) queryParams.append("limit", params.limit.toString())
      if (params.offset) queryParams.append("offset", params.offset.toString())
      url += `?${queryParams.toString()}`
    }

    try {
      const response = await fetch(url, { headers })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json() as Array<{
        id: string
        title: string
        slug: string
        excerpt?: string
        content: string
        author: string
        category: string
        featured: boolean
        tags: string[]
        image_url?: string
        read_time?: string
        status: string
        views: number
        published_at?: string
        created_at: string
        updated_at: string
      }>
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }
  },

  // Go-core uses /v1/cms/blog/posts/{slug} (no /slug/ segment)
  getBlogPost: async (slug: string) => {
    const headers: Record<string, string> = {
      
      "Content-Type": "application/json",
    }

    try {
      const response = await fetch(getCmsEndpointUrl(`/blog/posts/${encodeURIComponent(slug)}`), { headers })

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data?.error?.code === "post_not_found") return null

      return data
    } catch (error) {
      console.error("Error fetching blog post:", error)
      return null
    }
  },

  getBlogCategories: async () => {
    const headers: Record<string, string> = {
      
      "Content-Type": "application/json",
    }

    try {
      const response = await fetch(getCmsEndpointUrl("/blog/categories"), { headers })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json() as Array<{
        name: string
        slug: string
        description: string
        color: string
      }>
    } catch (error) {
      console.error("Error fetching blog categories:", error)
      return []
    }
  },

  subscribeNewsletter: async (email: string, preferences?: Record<string, unknown>) => {
    const headers: Record<string, string> = {
      
      "Content-Type": "application/json",
    }

    try {
      const response = await fetch(getCmsEndpointUrl("/blog/subscribe"), {
        method: "POST",
        headers,
        body: JSON.stringify({ email, preferences }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      return { status: "error", message: "Failed to subscribe" }
    }
  },

  submitContact: (data: {
    name: string
    email: string
    company?: string
    phone?: string
    message: string
    inquiry_type?: string
  }) =>
    apiRequest({
      url: getCmsEndpointUrl("/contact/submit"),
      method: "POST",
      data,
    }),

  // /api/cms/contact/options - NOT IN GO-CORE
  getContactOptions: () =>
    Promise.resolve({
      status: "error" as const,
      message: "Contact options are not available in the current API version.",
    }),

  submitDemoRequest: (data: {
    name: string
    email: string
    company: string
    phone?: string
    job_title?: string
    company_size?: string
    industry?: string
    preferred_time?: string
    preferred_date?: string
    message?: string
  }) =>
    apiRequest({
      url: getCmsEndpointUrl("/sales/demo-request"),
      method: "POST",
      data,
    }),

  submitQuoteRequest: (data: {
    company_name: string
    contact_email: string
    contact_name?: string
    phone?: string
    requirements?: string
    user_count?: number
    current_solution?: string
    budget_range?: string
    timeline?: string
  }) =>
    apiRequest({
      url: getCmsEndpointUrl("/sales/quote-request"),
      method: "POST",
      data,
    }),

  getServiceStatus: () =>
    apiRequest<Array<{
      name: string
      status: string
      uptime_percentage: number
    }>>({
      url: getCmsEndpointUrl("/status/services"),
    }),

  getSystemOverview: () =>
    apiRequest<{
      overall_status: string
      services: Array<{
        name: string
        status: string
        uptime_percentage: number
      }>
    }>({
      url: getCmsEndpointUrl("/status/overview"),
    }),

  getHelpArticles: (params?: {
    category?: string
    difficulty?: string
    limit?: number
    offset?: number
    search?: string
  }) =>
    apiRequest<Array<Record<string, unknown>>>({
      url: getCmsEndpointUrl("/help/articles"),
      params: params as Record<string, string>,
    }),

  getHelpCategories: () =>
    apiRequest<Array<Record<string, unknown>>>({
      url: getCmsEndpointUrl("/help/categories"),
    }),

  markArticleHelpful: (articleId: string, helpful: boolean) =>
    apiRequest({
      url: getCmsEndpointUrl(`/help/articles/${articleId}/helpful`),
      method: "POST",
      data: { helpful },
    }),

  getDocumentation: (params?: {
    category?: string
    difficulty?: string
    limit?: number
    offset?: number
    search?: string
  }) =>
    apiRequest<Array<Record<string, unknown>>>({
      url: getCmsEndpointUrl("/docs"),
      params: params as Record<string, string>,
    }),

  getDocumentationCategories: () =>
    apiRequest<Array<Record<string, unknown>>>({
      url: getCmsEndpointUrl("/docs/categories"),
    }),

  trackVisit: (data: {
    page: string
    session_id?: string
    ip_address?: string
    user_agent?: string
    referrer?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }) =>
    apiRequest({
      url: getCmsEndpointUrl("/analytics/track-visit"),
      method: "POST",
      data,
    }),

  trackEvent: (data: {
    event_type: string
    page?: string
    user_id?: string
    session_id?: string
    metadata?: Record<string, unknown>
  }) =>
    apiRequest({
      url: getCmsEndpointUrl("/analytics/track-event"),
      method: "POST",
      data,
    }),
}

// ──────────────────────────────────────────────
// DASHBOARD ENDPOINTS
// ──────────────────────────────────────────────
export const dashboardApi = {
  getEmployeeData: (token: string, since: string = "24h") =>
    apiRequest<{
      user_metrics: {
        total_queries: number
        successful_queries: number
        failed_queries: number
        avg_response_time_ms: number
        documents_accessed: number
      }
      recent_queries: Array<Record<string, unknown>>
      organization_stats: {
        organization_id: string
        total_documents: number
        new_documents: number
        active_users: number
      }
    }>({
      url: API_CONFIG.ENDPOINTS.DASHBOARD_EMPLOYEE,
      token,
      params: { period: since },
    }),

  getAdminData: (token: string, since: string = "24h", scope: "org" | "global" = "global") =>
    apiRequest<{
      system_health: {
        status: string
        api_response_time: number
        error_rate: number
      }
      user_analytics: {
        total_users: number
        active_users_today: number
      }
      content_metrics: {
        total_documents: number
        processing_queue: number
      }
      security_alerts: {
        failed_logins: number
        permission_denials: number
      }
      scope: string
      organization_id?: string
    }>({
      url: API_CONFIG.ENDPOINTS.DASHBOARD_ADMIN,
      token,
      params: { period: since, scope },
    }),

  // Quiz Management - all use /v1/admin/quizzes/...
  getQuizzes: (token: string, category?: string, difficulty?: string) => {
    const params: Record<string, string> = {}
    if (category) params.category = category
    if (difficulty) params.difficulty = difficulty

    return apiRequest<{
      items: Array<{
        id: string
        title: string
        description: string
        category: string
        difficulty: string
        time_limit_minutes: number
        passing_score: number
        questions: Array<{
          id: string
          type: string
          question: string
          options?: string[]
          correct_answer: string
          explanation?: string
          points: number
        }>
        active: boolean
        created_by: string
        created_at: string
        updated_at: string
      }>
      next_cursor: string | null
    }>({
      url: API_CONFIG.ENDPOINTS.ADMIN_QUIZZES,
      token,
      params,
    })
  },

  getQuiz: (quizId: string, token: string) =>
    apiRequest<Record<string, unknown>>({
      url: `${API_CONFIG.ENDPOINTS.ADMIN_QUIZZES}/${encodeURIComponent(quizId)}`,
      token,
    }),

  createQuiz: (quizData: Record<string, unknown>, token: string) => {
    return apiRequest<{ id: string }>({
      url: API_CONFIG.ENDPOINTS.ADMIN_QUIZZES,
      method: "POST",
      token,
      data: quizData,
    })
  },

  updateQuiz: (quizId: string, quizData: Record<string, unknown>, token: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.ADMIN_QUIZZES}/${encodeURIComponent(quizId)}`,
      method: "PATCH",
      token,
      data: quizData,
    }),

  deleteQuiz: (quizId: string, token: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.ADMIN_QUIZZES}/${encodeURIComponent(quizId)}`,
      method: "DELETE",
      token,
    }),

  getQuizStats: (quizId: string, token: string) =>
    apiRequest<{
      total_submissions: number
      passed: number
      avg_score: number
    }>({
      url: `${API_CONFIG.ENDPOINTS.ADMIN_QUIZZES}/${encodeURIComponent(quizId)}/statistics`,
      token,
    }),

  getQuizSubmissions: (quizId: string, token: string, limit: number = 50) =>
    apiRequest<{
      items: Array<Record<string, unknown>>
      next_cursor: string | null
    }>({
      url: `${API_CONFIG.ENDPOINTS.ADMIN_QUIZZES}/${encodeURIComponent(quizId)}/submissions`,
      token,
      params: { limit: limit.toString() },
    }),

  // Invite management - uses /v1/invites/
  createInvite: (token: string, data: {
    email?: string
    role: string
    expires_in_days?: number
    message?: string
  }) =>
    apiRequest({
      url: API_CONFIG.ENDPOINTS.INVITES,
      method: "POST",
      token,
      data,
    }),

  listInvites: (token: string) =>
    apiRequest<{ items: Array<Record<string, unknown>>; next_cursor: string | null }>({
      url: API_CONFIG.ENDPOINTS.INVITES,
      token,
    }),

  getInviteInfo: (inviteToken: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/${encodeURIComponent(inviteToken)}`,
    }),

  acceptInvite: (data: { token: string; username: string; password: string }) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/accept`,
      method: "POST",
      data,
    }),

  revokeInvite: (token: string, inviteId: string) =>
    apiRequest({
      url: `${API_CONFIG.ENDPOINTS.INVITES}/${encodeURIComponent(inviteId)}`,
      method: "DELETE",
      token,
    }),

  // POST /quiz/{filename} - NOT IN GO-CORE
  generateQuizFromDocument: (_filename: string, _token: string, _regenerate: boolean = false) =>
    Promise.resolve({
      status: "error" as const,
      message: "Quiz generation from documents is not available in the current API version.",
    }),

  // Messaging endpoints - all use /v1/messages/threads/
  messagingApi: {
    getMessageThreads: (token: string) =>
      apiRequest<{
        items: Array<{
          id: string
          organization_id: string
          subject: string
          status: string
          created_by?: string
          created_at: string
          updated_at: string
          last_message_at: string
        }>
        next_cursor: string | null
      }>({
        url: API_CONFIG.ENDPOINTS.MESSAGES_THREADS,
        token,
      }),

    getThreadMessages: (threadId: string, token: string) =>
      apiRequest<{
        items: Array<{
          id: string
          thread_id: string
          organization_id: string
          sender_type: string
          sender_name: string
          sender_email?: string
          body: string
          message_type: string
          read_at?: string
          created_at: string
        }>
        next_cursor: string | null
      }>({
        url: `${API_CONFIG.ENDPOINTS.MESSAGES_THREADS}/${encodeURIComponent(threadId)}/messages`,
        token,
      }),

    createMessageThread: (token: string, data: {
      subject: string
      message: string
      organization_id?: string
    }) =>
      apiRequest<{ id: string }>({
        url: API_CONFIG.ENDPOINTS.MESSAGES_THREADS,
        method: "POST",
        token,
        data,
      }),

    addMessageToThread: (threadId: string, token: string, data: {
      message: string
      message_type?: string
    }) =>
      apiRequest<{ id: string }>({
        url: `${API_CONFIG.ENDPOINTS.MESSAGES_THREADS}/${encodeURIComponent(threadId)}/messages`,
        method: "POST",
        token,
        data,
      }),

    markMessageAsRead: (messageId: string, token: string) =>
      apiRequest({
        url: `${API_CONFIG.V1_PREFIX}/messages/${encodeURIComponent(messageId)}/read`,
        method: "POST",
        token,
      }),

    getUnreadCount: (token: string) =>
      apiRequest<{ unread_count: number }>({
        url: API_CONFIG.ENDPOINTS.MESSAGES_UNREAD_COUNT,
        token,
      }),

    approveOrganization: (orgId: string, token: string) =>
      apiRequest({
        url: `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${encodeURIComponent(orgId)}/approve`,
        method: "POST",
        token,
      }),

    rejectOrganization: (orgId: string, token: string, reason?: string) =>
      apiRequest({
        url: `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${encodeURIComponent(orgId)}/reject`,
        method: "POST",
        token,
        data: reason ? { reason } : undefined,
      }),

    changeOrganizationStatus: (orgId: string, token: string, newStatus: string) =>
      apiRequest({
        url: `${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${encodeURIComponent(orgId)}`,
        method: "PATCH",
        token,
        data: { status: newStatus },
      }),

    getPendingOrganizations: (token: string) =>
      apiRequest<{
        items: Array<{
          id: string
          name: string
          slug: string
          status: string
          description?: string
          admin_user_id?: string
          created_at: string
          updated_at: string
        }>
        next_cursor: string | null
      }>({
        url: API_CONFIG.ENDPOINTS.ORGANIZATIONS_PENDING,
        token,
      }),
  },
}
