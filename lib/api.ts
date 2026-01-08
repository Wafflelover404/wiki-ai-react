const API_BASE_URL = "http://localhost:9001"

interface ApiRequestOptions {
  url: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
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
  role?: "user" | "admin"
}

export async function apiRequest<T = unknown>({
  url,
  method = "GET",
  token,
  data,
  params,
}: ApiRequestOptions): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
  }

  // Only set Content-Type for non-FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Add query params
  let fullUrl = `${API_BASE_URL}${url}`
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

    const result = await response.json()

    if (!response.ok) {
      // Handle structured validation errors (e.g., from FastAPI)
      let errorMessage = "Request failed"
      if (result.detail) {
        if (typeof result.detail === 'string') {
          errorMessage = result.detail
        } else if (Array.isArray(result.detail) && result.detail.length > 0) {
          // Handle FastAPI validation errors: [{type, loc, msg, input}]
          const firstError = result.detail[0]
          errorMessage = firstError.msg || JSON.stringify(firstError)
        } else if (typeof result.detail === 'object' && result.detail.msg) {
          errorMessage = result.detail.msg
        } else {
          errorMessage = JSON.stringify(result.detail)
        }
      } else if (result.message) {
        errorMessage = result.message
      }
      
      return {
        status: "error",
        message: errorMessage,
      }
    }

    return result
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
    }
  }
}

// Auth endpoints
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Network error",
      }
    }
  },

  validateToken: (token: string) =>
    apiRequest<{
      valid: boolean
      username: string
      role: string
      organization?: string
      organization_id?: string
      organization_name?: string
    }>({
      url: "/token/validate",
      token,
    }),

  checkAdminAccess: (token: string) =>
    apiRequest<{ admin: boolean }>({
      url: "/admin/access",
      token,
    }),

  createOrganization: (data: { organization_name: string; admin_username: string; admin_password: string }) =>
    apiRequest({
      url: "/organizations/create_with_admin",
      method: "POST",
      data,
    }),

  switchOrganization: (token: string, data: { organization_id?: string; organization_slug?: string }) =>
    apiRequest<{ token: string }>({
      url: "/organizations/switch",
      method: "POST",
      token,
      data,
    }),

  listMemberships: (token: string) =>
    apiRequest<{ memberships: Array<{ organization_id: string; organization_name: string; role: string }> }>({
      url: "/organizations/memberships",
      token,
    }),

  listMembers: (token: string) =>
    apiRequest<{ members: Array<{ user_id: string; username: string; role: string }> }>({
      url: "/organizations/members",
      token,
    }),

  createInvite: (token: string, email: string, role = "member") =>
    apiRequest({
      url: "/organizations/invites",
      method: "POST",
      token,
      data: { email, role },
    }),

  acceptInvite: (inviteToken: string, password: string, name: string) =>
    apiRequest({
      url: "/organizations/invites/accept",
      method: "POST",
      data: { token: inviteToken, password, name },
    }),

  updateMemberRole: (token: string, user_id: string, role: string) =>
    apiRequest({
      url: "/organizations/members/role",
      method: "POST",
      token,
      data: { user_id, role },
    }),

  revokeInvite: (token: string, invite_id: string) =>
    apiRequest({
      url: `/organizations/invites/${encodeURIComponent(invite_id)}`,
      method: "DELETE",
      token,
    }),
}

export const filesApi = {
  // GET /files/list returns { status: 'success', response: { documents: [...] } }
  list: (token: string) =>
    apiRequest<{
      documents: Array<{ filename: string; original_filename?: string; size?: number; uploaded_at?: string }>
    }>({
      url: "/files/list",
      token,
    }),

  // GET /files/content/:filename - returns content (text or base64 for binary files)
  getContent: async (token: string, filename: string) => {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    }
    const response = await fetch(`${API_BASE_URL}/files/content/${encodeURIComponent(filename)}`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    const isJsonResponse = contentType && contentType.includes('application/json')
    
    if (isJsonResponse) {
      // Backend returns JSON with base64 content for binary files
      const data = await response.json()
      return {
        status: "success" as const,
        response: { 
          content: data.content, 
          isBinary: data.isBinary || false 
        }
      }
    } else {
      // Fallback to original binary handling
      const isBinary = contentType && (
        contentType.includes('application/pdf') ||
        contentType.includes('application/msword') ||
        contentType.includes('application/vnd.openxmlformats-officedocument') ||
        contentType.includes('application/octet-stream')
      )

      if (isBinary) {
        // Convert binary content to base64
        const blob = await response.blob()
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        // Remove the data URL prefix to get just the base64 content
        const base64Content = (base64 as string).split(',')[1]
        return {
          status: "success" as const,
          response: { content: base64Content, isBinary: true }
        }
      } else {
        // Handle text content
        const content = await response.text()
        return {
          status: "success" as const,
          response: { content, isBinary: false }
        }
      }
    }
  },

  // POST /upload - file upload (supports multiple files)
  upload: async (token: string, files: File[]) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`file`, file)
    })

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    })

    return response.json()
  },

  // POST /files/edit with { filename, new_content }
  edit: (token: string, filename: string, newContent: string) =>
    apiRequest({
      url: "/files/edit",
      method: "POST",
      token,
      data: { filename, new_content: newContent },
    }),

  // DELETE /files/delete_by_fileid with { file_id }
  deleteById: (token: string, fileId: string) =>
    apiRequest({
      url: "/files/delete_by_fileid",
      method: "DELETE",
      token,
      data: { file_id: fileId },
    }),

  // DELETE /files/delete_by_filename with ?filename=...
  deleteByFilename: (token: string, filename: string) =>
    apiRequest({
      url: "/files/delete_by_filename",
      method: "DELETE",
      token,
      params: { filename },
    }),

  // POST /files/index
  index: (token: string) =>
    apiRequest({
      url: "/files/index",
      method: "POST",
      token,
      data: {},
    }),
}

export const queryApi = {
  // POST /query with { question, session_id, model, humanize }
  query: (token: string, question: string, options?: { session_id?: string; model?: string; humanize?: boolean }) =>
    apiRequest<{
      immediate?: {
        files: string[]
        snippets: Array<{
          content: string
          source: string
        }>
        model: string
        security_info: {
          user_filtered: boolean
          username: string
          source_documents_count: number
          security_filtered: boolean
        }
      }
      overview?: string
      model?: string
      security_info?: {
        user_filtered: boolean
        username: string
        source_documents_count: number
        security_filtered: boolean
      }
    }>({
      url: "/query",
      method: "POST",
      token,
      data: {
        question,
        session_id: options?.session_id || null,
        model: options?.model || null,
        humanize: options?.humanize ?? true,
      },
    }),

  // WebSocket query for real-time streaming
  queryWebSocket: async (
    token: string, 
    question: string, 
    options?: { 
      session_id?: string; 
      model?: string; 
      humanize?: boolean;
      onMessage?: (message: any) => void;
    }
  ) => {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(API_BASE_URL)
        const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${wsProtocol}//${url.host}/ws/query?token=${encodeURIComponent(token)}`
        
        const ws = new WebSocket(wsUrl)
        let hasError = false
        let immediateData: any = null
        let overviewData: any = null
        let chunksData: any = null
        
        ws.onopen = () => {
          // Send query
          ws.send(JSON.stringify({
            question,
            session_id: options?.session_id || null,
            model: options?.model || null,
            humanize: options?.humanize ?? true
          }))
        }
        
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            
            // Call the message handler
            if (options?.onMessage) {
              options.onMessage(message)
            }
            
            // Store data based on message type
            switch (message.type) {
              case 'status':
                // Processing status update
                break
              case 'immediate':
                immediateData = message.data
                break
              case 'overview':
                overviewData = message.data
                break
              case 'chunks':
                chunksData = message.data
                break
              case 'error':
                hasError = true
                reject(new Error(message.message || 'WebSocket query error'))
                ws.close()
                break
              case 'complete':
                // Query completed successfully
                ws.close()
                
                // Resolve with combined data
                const result = {
                  status: 'success',
                  response: {
                    immediate: immediateData,
                    answer: overviewData,
                    chunks: chunksData?.chunks,
                    available_files: chunksData?.available_files,
                    possible_files_by_title: chunksData?.possible_files_by_title,
                    model: immediateData?.model,
                    security_info: immediateData?.security_info
                  }
                }
                resolve(result)
                break
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
            if (options?.onMessage) {
              options.onMessage({ type: 'error', message: 'Failed to parse message' })
            }
          }
        }
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          if (!hasError) {
            reject(new Error('WebSocket connection error'))
          }
        }
        
        ws.onclose = (event) => {
          if (!hasError && event.code !== 1000) {
            console.error('WebSocket closed unexpectedly:', event.code, event.reason)
            reject(new Error(`WebSocket closed: ${event.reason || 'Unknown reason'}`))
          }
        }
        
      } catch (error) {
        reject(error)
      }
    })
  }
}

export const reportsApi = {
  // GET /reports/get/auto
  getAuto: async (token: string) => {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }

    const res = await fetch(`${API_BASE_URL}/reports/get/auto`, {
      method: "GET",
      headers,
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch auto reports: ${res.status}`)
    }

    const data = await res.json()
    return {
      status: "success" as const,
      response: {
        reports: data.reports || [],
      },
    }
  },

  // GET /reports/get/manual
  getManual: async (token: string) => {
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }

    const res = await fetch(`${API_BASE_URL}/reports/get/manual`, {
      method: "GET",
      headers,
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch manual reports: ${res.status}`)
    }

    const data = await res.json()
    return {
      status: "success" as const,
      response: {
        reports: data.reports || [],
      },
    }
  },

  // POST /reports/submit/manual with { issue }
  submitManual: (token: string, issue: string) =>
    apiRequest({
      url: "/reports/submit/manual",
      method: "POST",
      token,
      data: { issue },
    }),
}

export const adminApi = {
  // GET /accounts
  listAccounts: async (token: string) => {
    // graphtalk returns a raw JSON array from GET /accounts
    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }

    try {
      const res = await fetch(`${API_BASE_URL}/accounts`, {
        method: "GET",
        headers,
      })

      const data = await res.json()

      if (!res.ok) {
        return {
          status: "error" as const,
          message:
            (data && (data.message || data.detail)) || `Failed to fetch accounts: ${res.status}`,
        }
      }

      // If backend later changes to APIResponse, handle that too.
      if (data && typeof data === "object" && !Array.isArray(data) && (data as any).status) {
        const wrapped = data as any
        const accounts = wrapped.response?.accounts || wrapped.response || wrapped.accounts || []
        return {
          status: wrapped.status as "success" | "error",
          message: wrapped.message,
          response: { accounts },
        }
      }

      if (Array.isArray(data)) {
        return {
          status: "success" as const,
          response: { accounts: data },
        }
      }

      return {
        status: "error" as const,
        message: "Unexpected /accounts response format",
      }
    } catch (error) {
      return {
        status: "error" as const,
        message: error instanceof Error ? error.message : "Network error",
      }
    }
  },

  // POST /register
  createUser: (
    token: string,
    userData: { username: string; password: string; role: string; allowed_files?: string[] },
  ) =>
    apiRequest({
      url: "/register",
      method: "POST",
      token,
      data: userData,
    }),

  // POST /user/edit
  editUser: (
    token: string,
    userData: { username: string; role?: string; password?: string; allowed_files?: string[] },
  ) =>
    apiRequest({
      url: "/user/edit",
      method: "POST",
      token,
      data: userData,
    }),

  // DELETE /user/delete with ?username=...
  deleteUser: (token: string, username: string) =>
    apiRequest({
      url: "/user/delete",
      method: "DELETE",
      token,
      params: { username },
    }),
}

// Catalogs endpoints
export const catalogsApi = {
  list: (token: string) =>
    apiRequest<{ catalogs: Array<{ catalog_id: string; shop_name: string; total_products: number }> }>({
      url: "/catalogs",
      token,
    }),

  create: (token: string, name: string) =>
    apiRequest<{ catalog_id: string; shop_name: string }>({
      url: "/catalogs/create",
      method: "POST",
      token,
      data: { name },
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
      url: `/catalogs/${catalogId}/search`,
      method: "GET",
      token,
      params: { query },
    }),

  delete: (token: string, catalogId: string) =>
    apiRequest({
      url: `/catalogs/${catalogId}`,
      method: "DELETE",
      token,
    }),
}

// Plugins endpoints
export const pluginsApi = {
  status: (token: string) =>
    apiRequest<{ enabled: boolean; status: string }>({
      url: "/plugins/status",
      token,
    }),

  enable: (token: string, plugin = "opencart") =>
    apiRequest({
      url: `/plugins/${plugin}/enable`,
      method: "POST",
      token,
    }),

  disable: (token: string, plugin = "opencart") =>
    apiRequest({
      url: `/plugins/${plugin}/disable`,
      method: "POST",
      token,
    }),

  listTokens: (token: string) =>
    apiRequest<{ tokens: Array<{ id: string; name: string; created_at: string }> }>({
      url: "/plugins/tokens",
      token,
    }),

  createToken: (token: string, name: string) =>
    apiRequest<{ token: string; id: string }>({
      url: "/plugins/tokens/create",
      method: "POST",
      token,
      data: { token_name: name },
    }),

  deleteToken: (token: string, tokenId: string) =>
    apiRequest({
      url: `/plugins/tokens/${tokenId}`,
      method: "DELETE",
      token,
    }),
}

// OpenCart endpoints
export const opencartApi = {
  importProducts: (token: string, catalogId: string) =>
    apiRequest({
      url: "/opencart/products/import",
      method: "POST",
      token,
      data: { catalog_id: catalogId },
    }),
}

// API Keys endpoints
export const apiKeysApi = {
  list: (token: string) =>
    apiRequest<{ keys: Array<{ id: string; name: string; created_at: string; last_used?: string }> }>({
      url: "/api-keys/list",
      token,
    }),

  create: (token: string, name: string) =>
    apiRequest<{ key: string; id: string }>({
      url: "/api-keys/create",
      method: "POST",
      token,
      data: { name },
    }),

  delete: (token: string, keyId: string) =>
    apiRequest({
      url: `/api-keys/${keyId}`,
      method: "DELETE",
      token,
    }),
}

// Metrics endpoints
export const metricsApi = {
  summary: (token: string) =>
    apiRequest<{
      total_queries: number
      successful_queries: number
      failed_queries: number
      avg_response_time: number
    }>({
      url: "/metrics/summary",
      token,
    }),

  queries: (token: string, limit?: number) =>
    apiRequest<{ queries: Array<{ question: string; answer: string; timestamp: string }> }>({
      url: `/metrics/queries${limit ? `?limit=${limit}` : ""}`,
      token,
    }),
}
