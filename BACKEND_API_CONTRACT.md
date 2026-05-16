# Backend API Contract — what the frontend expects

Base URL: `{NEXT_PUBLIC_API_URL}` (default `https://api.wikiai.by`, dev `http://localhost:9001`)
All paths are under `/v1/`. Go-core edge gateway (port 9001) proxies to microservices.

---

## Identity Service (port 9002) — routed by gateway via `/v1/auth`, `/v1/me`, `/v1/organizations`, `/v1/invites`, `/v1/api-keys`, `/v1/permissions`

### `POST /v1/auth/login`
- **What**: Authenticate user, return JWT tokens + user/org info
- **Request**: `{"username": string, "password": string}`
- **Response**:
  ```json
  {
    "access_token": string,
    "refresh_token": string,
    "expires_in": int,
    "user": {"id": string, "email"?: string, "username": string, "display_name"?: string, "status": string},
    "organization": {"id": string, "name": string, "slug": string, "status": string},
    "memberships"?: [{"organization_id": string, "role": string, "status": string}]
  }
  ```
- **Frontend transforms**: `authApi.login()` in `lib/api.ts:117` — extracts `access_token`, `refresh_token`, `role` from memberships, `user`, `organization`
- **Callers**: `components/login-form.tsx:70`, `lib/auth-context.tsx:57`

### `POST /v1/auth/cms-login`
- **What**: CMS-specific auth using master credentials
- **Request**: `{"username": string, "password": string}`
- **Response**: Same `LoginResponse` format
- **Callers**: `components/cms-login.tsx:27`
- **Backend**: Checks against `CMS_MASTER_USER` / `CMS_MASTER_KEY` config vars

### `POST /v1/auth/refresh`
- **What**: Refresh access token
- **Request**: `{"refresh_token": string}`
- **Response**: Same `LoginResponse` format
- **Callers**: Not currently called from frontend (defined in config only)

### `POST /v1/auth/logout`
- **What**: Revoke refresh token
- **Request**: `{"refresh_token": string}`
- **Response**: `{"revoked": bool}`
- **Callers**: Not currently called from frontend (defined in config only)

### `GET /v1/me`
- **What**: Validate token, return user + org from JWT claims
- **Request**: Header `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "user": {"id": string, "username": string, "role": string},
    "organization": {"id": string, "name": string},
    "permissions": [string]
  }
  ```
- **Frontend transforms**: `authApi.validateToken()` at `lib/api.ts:157` → `{valid, username, role, organization, organization_id, organization_name}`; `authApi.checkAdminAccess()` at `lib/api.ts:189` → `{admin: bool}`
- **Callers**: `lib/auth-context.tsx:30`, `hooks/use-websocket-messaging.ts:29`, `hooks/useUserData.ts`, `lib/api.ts:475` (resolveTenantId)

### `POST /v1/organizations`
- **What**: Create organization with admin user, auto-login
- **Request**: `{"organization_name": string, "admin_username": string, "admin_password": string, "admin_email"?: string}`
- **Response**: `LoginResponse` (201)
- **Callers**: `components/login-form.tsx:70`, `authApi.createOrganization()` at `lib/api.ts:209`

### `GET /v1/organizations/pending`
- **What**: List organizations with `pending` status (admin only)
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"items": [Organization], "next_cursor": null}`
- **Callers**: `dashboardApi.messagingApi.getPendingOrganizations()` at `lib/api.ts:1722`

### `POST /v1/organizations/{id}/approve`
- **What**: Approve a pending organization (admin only)
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `Organization` (200)
- **Callers**: `dashboardApi.messagingApi.approveOrganization()` at `lib/api.ts:1699`

### `POST /v1/organizations/{id}/reject`
- **What**: Reject a pending organization (admin only)
- **Request**: Header `Authorization: Bearer {token}`, body: `{"reason"?: string}`
- **Response**: `Organization` (200)
- **Callers**: `dashboardApi.messagingApi.rejectOrganization()` at `lib/api.ts:1706`

### `PATCH /v1/organizations/{id}`
- **What**: Change organization status (admin only)
- **Request**: `{"status": string}`
- **Response**: `Organization` (200)
- **Callers**: `dashboardApi.messagingApi.changeOrganizationStatus()` at `lib/api.ts:1714`

### `GET /v1/organizations/status-by-email/{email}`
- **What**: Check if an email has an associated organization (public)
- **Response**: `{"known": bool}`
- **Callers**: `adminApi.getOrganizationStatusByEmail()` at `lib/api.ts:773`, `app/review-status/page.tsx:42`

### `POST /v1/invites`
- **What**: Create an invite link for a new user
- **Request**: `{"email"?: string, "role": string, "expires_in_days"?: int, "message"?: string}` (note: `allowed_files` from frontend is silently ignored)
- **Response**: `{"invite": Invite, "token": string, "link": string}` (201)
- **Callers**: `authApi.createInvite()` at `lib/api.ts:240`, `adminApi.createInvite()` at `lib/api.ts:699`, `dashboardApi.createInvite()` at `lib/api.ts:1578`

### `GET /v1/invites`
- **What**: List invites for current org
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"items": [Invite], "next_cursor": null}`
- **Callers**: `adminApi.listInvites()` at `lib/api.ts:730`, `dashboardApi.listInvites()` at `lib/api.ts:1591`

### `GET /v1/invites/{token}`
- **What**: Preview an invite by its token (public)
- **Response**: `{"valid": bool, "invite": Invite}`
- **Callers**: `adminApi.getInviteInfo()` at `lib/api.ts:737`, `dashboardApi.getInviteInfo()` at `lib/api.ts:1597`, `app/invite/page.tsx:81`, `app/app/invite/page.tsx:62`

### `POST /v1/invites/accept`
- **What**: Accept invite, create user account, auto-login
- **Request**: `{"token": string, "username": string, "password": string, "display_name"?: string}`
- **Response**: `LoginResponse` (201)
- **Callers**: `authApi.acceptInvite()` at `lib/api.ts:249`, `adminApi.acceptInvite()` at `lib/api.ts:754`, `dashboardApi.acceptInvite()` at `lib/api.ts:1602`, `app/invite/page.tsx:128`

### `DELETE /v1/invites/{id}`
- **What**: Revoke an invite
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `authApi.revokeInvite()` at `lib/api.ts:264`, `adminApi.revokeInvite()` at `lib/api.ts:765`, `dashboardApi.revokeInvite()` at `lib/api.ts:1609`

### `GET /v1/api-keys`
- **What**: List API keys for current org
- **Request**: Header `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "items": [{
      "id": string, "name": string, "key_prefix": string, "description"?: string,
      "permissions": [string], "status": string, "is_active"?: bool,
      "created_at": string, "last_used_at"?: string, "expires_at"?: string,
      "rate_limit_requests": int, "rate_limit_period": string,
      "llm_enabled": bool, "max_tokens_per_day": int, "llm_cost_limit": float
    }],
    "next_cursor": null
  }
  ```
- **Callers**: `apiKeysApi.list()` at `lib/api.ts:936`

### `POST /v1/api-keys`
- **What**: Create new API key
- **Request**: `{"name": string, "description"?: string, "permissions": [string], "expires_in_days"?: int}`
- **Response**:
  ```json
  {"api_key": {id, name, key_prefix, permissions, status, created_at}, "full_key": string}
  ```
- **Callers**: `apiKeysApi.create()` at `lib/api.ts:961`

### `POST /v1/api-keys/{id}/revoke`
- **What**: Revoke an API key
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `apiKeysApi.revoke()` at `lib/api.ts:1006`

### `GET /v1/permissions`
- **What**: List all available permissions (public)
- **Response**: `{"permissions": {"key": "description", ...}}`
- **Callers**: `apiKeysApi.getPermissions()` at `lib/api.ts:1045`

---

## KMS (Knowledge Management System, external service, port 8080) — routed by gateway via `/v1/search`, `/v1/documents`, `/v1/files`

### `POST /v1/search`
- **What**: Search knowledge base for relevant document chunks
- **Request**: `{"tenant_id": string, "query": string, "top_k"?: int}` + header `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "results": [{"chunk_id": string, "document_id": string, "content": string, "final_score": float, "source": string, "metadata"?: object}],
    "query_id": string, "took_ms": int
  }
  ```
- **Frontend transforms**: `queryApi.query()` at `lib/api.ts:504` → `{answer, chunks, model?, query_id, took_ms, security}`
- **Also used for**: `aiAgentApi.batchOverviews()` at `lib/api.ts:1158` sends `{"queries": [string], "results": [...]}` and expects `{"overviews": [string]}`
- **Callers**: `queryApi.query()` and `queryApi.queryStream()` at `lib/api.ts:504,553`, `app/app/admin/search/page.tsx:437,536`, `app/app/search/page.tsx:360,459`, `app/search/page.tsx:251`, `app/admin/search/page.tsx:262`

### `POST /v1/documents`
- **What**: Upload/ingest a document into the knowledge base
- **Request**: `{"tenant_id": string, "title": string, "source_url": string, "content": string, "doc_type": string}` + header `Authorization: Bearer {token}`
- **Response**: `{"document_id": string, "chunk_ids": [string], "status": string, "content_hash": string, "chunk_count": int}`
- **Callers**: `filesApi.upload()` at `lib/api.ts:398` — converts files to text content first

### `GET /v1/files`
- **What**: List all files/documents in the knowledge base
- **Request**: Header `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "items": [{"id": string, "organization_id": string, "filename": string, "content_type": string, "size_bytes": int, "status": string, "uploaded_by": string, "metadata": object, "created_at": string, "updated_at": string}],
    "next_cursor": null
  }
  ```
- **Frontend transforms**: `filesApi.list()` at `lib/api.ts:287` → `{documents: [{id, filename, upload_timestamp, organization_id, file_size}]}`
- **Callers**: ~15 files — `app/app/admin/files/page.tsx:124`, `app/app/files/page.tsx:617`, `app/app/admin/quizzes/page.tsx:300`, etc.

### `GET /v1/files/{id}/content`
- **What**: Get file content by file UUID
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: JSON `{"content": string, "isBinary": bool}` OR raw binary blob (PDF, docx, etc.)
- **Callers**: `filesApi.getContent()` at `lib/api.ts:328`, `components/ui/file-reader.tsx:935`, `app/app/admin/files/page.tsx:572`

### `DELETE /v1/files/{id}`
- **What**: Delete a file by UUID
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `filesApi.deleteById()` at `lib/api.ts:428`, `filesApi.deleteByFilename()` at `lib/api.ts:436`

### `POST /v1/files/{id}/reindex`
- **What**: Reindex a file in the knowledge base
- **Request**: `{}` + header `Authorization: Bearer {token}`
- **Response**: `200 OK` with file record
- **Callers**: `filesApi.index()` at `lib/api.ts:445`

---

## Analytics Service (port 9004) — routed by gateway via `/v1/metrics`, `/v1/dashboard`

### `GET /v1/metrics/summary`
- **What**: Get aggregated metrics summary
- **Request**: Header `Authorization: Bearer {token}`, query: `?period=&scope=`
- **Response**:
  ```json
  {
    "total_queries": int, "successful_queries": int, "failed_queries": int,
    "avg_response_time_ms": int, "unique_users": int
  }
  ```
- **Callers**: `metricsApi.summary()` at `lib/api.ts:1056`, `app/app/admin/page.tsx:80`, `app/app/dashboard/user.tsx:48`, etc.

### `GET /v1/metrics/queries`
- **What**: List recent queries with details
- **Request**: Header `Authorization: Bearer {token}`, query: `?period=&scope=&limit=&offset=`
- **Response**: `{"items": [QueryEvent], "next_cursor": null}`
- **Callers**: `metricsApi.queries()` at `lib/api.ts:1069`, `components/dashboard/EmployeeDashboard.tsx:179`

### `GET /v1/metrics/volume`
- **What**: Get query volume time series data
- **Request**: Header `Authorization: Bearer {token}`, query: `?days=&scope=`
- **Response**:
  ```json
  {
    "period": string, "total_queries": int,
    "data": [{"date": string, "queries": int, "success": int, "failed": int, "avgResponseTime": int, "uniqueUsers": int}]
  }
  ```
- **Callers**: `metricsApi.volume()` at `lib/api.ts:1090`, `app/app/admin/page.tsx:83`

### `GET /v1/dashboard/employee`
- **What**: Get employee dashboard data
- **Request**: Header `Authorization: Bearer {token}`, query: `?period=`
- **Response**:
  ```json
  {
    "user_metrics": {"total_queries": int, "successful_queries": int, "failed_queries": int, "avg_response_time_ms": int, "documents_accessed": int},
    "recent_queries": [QueryEvent],
    "organization_stats": {"organization_id": string, "total_documents": int, "new_documents": int, "active_users": int}
  }
  ```
- **Callers**: `dashboardApi.getEmployeeData()` at `lib/api.ts:1441`, `components/dashboard/EmployeeDashboard.tsx:82,149`

### `GET /v1/dashboard/admin`
- **What**: Get admin dashboard data
- **Request**: Header `Authorization: Bearer {token}`, query: `?period=&scope=`
- **Response**:
  ```json
  {
    "system_health": {"status": string, "api_response_time": int, "error_rate": int},
    "user_analytics": {"total_users": int, "active_users_today": int},
    "content_metrics": {"total_documents": int, "processing_queue": int},
    "security_alerts": {"failed_logins": int, "permission_denials": int},
    "scope": string, "organization_id"?: string
  }
  ```
- **Callers**: `dashboardApi.getAdminData()` at `lib/api.ts:1463`, `components/dashboard/AdminDashboardEnhanced.tsx:135`

---

## Catalog Service (port 9005) — routed by gateway via `/v1/plugins`, `/v1/opencart`, `/v1/catalogs`

### `GET /v1/plugins`
- **What**: List plugins for current org
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"items": [{"id": string, "plugin_key": string, "enabled": bool, "config"?: object, "updated_at": string}], "next_cursor": null}`
- **Callers**: `pluginsApi.status()` at `lib/api.ts:844`

### `PATCH /v1/plugins/{plugin_key}`
- **What**: Enable/disable a plugin
- **Request**: `{"enabled": bool, "config"?: object}`
- **Response**: `Plugin`
- **Callers**: `pluginsApi.enable()` / `pluginsApi.disable()` at `lib/api.ts:860,868`

### `GET /v1/plugins/tokens`
- **What**: List plugin tokens
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"items": [{"id": string, "plugin_key": string, "name": string, "token_prefix": string, "created_at": string, "revoked_at"?: string}], "next_cursor": null}`
- **Callers**: `pluginsApi.listTokens()` at `lib/api.ts:876`

### `POST /v1/plugins/tokens`
- **What**: Create plugin token
- **Request**: `{"plugin_key": string, "name": string}`
- **Response** (201): `{"token": string, "plugin_token": PluginToken}`
- **Callers**: `pluginsApi.createToken()` at `lib/api.ts:893`

### `DELETE /v1/plugins/tokens/{id}`
- **What**: Revoke a plugin token
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `pluginsApi.deleteToken()` at `lib/api.ts:909`

### `POST /v1/catalogs`
- **What**: Create a new catalog
- **Request**: `{"name": string, "shop_name"?: string, "description"?: string}`
- **Response** (201):
  ```json
  {"id": string, "name": string, "description"?: string, "total_products": int, "indexed_products": int, "active": bool, "created_at": string, "updated_at": string}
  ```
- **Callers**: `catalogsApi.create()` at `lib/api.ts:803`

### `GET /v1/catalogs`
- **What**: List catalogs
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"items": [Catalog], "next_cursor": null}`
- **Callers**: `catalogsApi.list()` at `lib/api.ts:785`

### `GET /v1/catalogs/{id}/search`
- **What**: Search products within a catalog
- **Request**: Header `Authorization: Bearer {token}`, query: `?query=`
- **Response**:
  ```json
  {"results": [{"chunk_id": string, "document_id": string, "content": string, "final_score": float, "source"?: string, "metadata"?: object}], "query_id": string, "took_ms": int}
  ```
- **Frontend expects transformation to**: `{"products": [{id, name, description, price, special_price?, image?, url?, quantity?, shop_name?, score?}]}`
- **Callers**: `catalogsApi.search()` at `lib/api.ts:811`

### `DELETE /v1/catalogs/{id}`
- **What**: Soft-delete a catalog
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `catalogsApi.delete()` at `lib/api.ts:831`

### `POST /v1/opencart/products/import`
- **What**: Import products from OpenCart
- **Request**: `{"catalog_id": string, "products": [{product_id, name, sku?, price, special?, description?, url, image?, quantity?, status?, rating?}]}`
- **Response** (202): `{"imported": int, "indexed": int}`
- **Callers**: `opencartApi.importProducts()` at `lib/api.ts:922`

---

## Learning Service (port 9006) — routed by gateway via `/v1/admin/quizzes`, `/v1/quizzes`, `/v1/reports`, `/v1/messages`

### `GET /v1/admin/quizzes`
- **What**: List all quizzes (admin view)
- **Request**: Header `Authorization: Bearer {token}`, query: `?category=&difficulty=`
- **Response**:
  ```json
  {
    "items": [{
      "id": string, "title": string, "description": string, "category": string,
      "difficulty": string, "time_limit_minutes": int, "passing_score": int,
      "questions": [{"id": string, "type": string, "question": string, "options"?: [string], "correct_answer": string, "explanation"?: string, "points": int}],
      "active": bool, "created_by": string, "created_at": string, "updated_at": string
    }],
    "next_cursor": null
  }
  ```
- **Callers**: `dashboardApi.getQuizzes()` at `lib/api.ts:1491`

### `POST /v1/admin/quizzes`
- **What**: Create a new quiz
- **Request**: Full `Quiz` object (title, description, category, difficulty, time_limit_minutes, passing_score, questions[])
- **Response** (201): `Quiz`
- **Callers**: `dashboardApi.createQuiz()` at `lib/api.ts:1533`

### `GET /v1/admin/quizzes/{id}`
- **What**: Get a single quiz by ID
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `Quiz`
- **Callers**: `dashboardApi.getQuiz()` at `lib/api.ts:1527`

### `PATCH /v1/admin/quizzes/{id}`
- **What**: Update a quiz (partial)
- **Request**: Partial `Quiz` object
- **Response**: `Quiz`
- **Callers**: `dashboardApi.updateQuiz()` at `lib/api.ts:1542`

### `DELETE /v1/admin/quizzes/{id}`
- **What**: Soft-delete a quiz (sets `active=false`)
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `dashboardApi.deleteQuiz()` at `lib/api.ts:1550`

### `GET /v1/admin/quizzes/{id}/statistics`
- **What**: Get quiz submission statistics
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"total_submissions": int, "passed": int, "avg_score": int}`
- **Callers**: `dashboardApi.getQuizStats()` at `lib/api.ts:1557`

### `GET /v1/admin/quizzes/{id}/submissions`
- **What**: List quiz submissions
- **Request**: Header `Authorization: Bearer {token}`, query: `?limit=`
- **Response**: `{"items": [QuizSubmission], "next_cursor": null}`
- **Callers**: `dashboardApi.getQuizSubmissions()` at `lib/api.ts:1567`

### `GET /v1/quizzes`
- **What**: List active quizzes (user view)
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"items": [Quiz], "next_cursor": null}`
- **Callers**: `app/app/quizzes/page.tsx:62` (direct fetch)

### `POST /v1/quizzes/{id}/submit`
- **What**: Submit answers to a quiz
- **Request**: `{"answers": {"question_id": "chosen_answer"}, "time_spent": int}`
- **Backend expects**: `{"answers": map[string]string, "time_spent_seconds": int}`
- **Response** (201): `QuizSubmission`
- **Callers**: `app/app/quizzes/page.tsx:100` (direct fetch)

### `GET /v1/reports`
- **What**: List reports, filtered by type
- **Request**: Header `Authorization: Bearer {token}`, query: `?type=auto|manual`
- **Response**: `{"items": [Report], "next_cursor": null}`
- **Callers**: `reportsApi.getAuto()` / `reportsApi.getManual()` at `lib/api.ts:618,634`

### `POST /v1/reports`
- **What**: Submit a manual report
- **Request**: `{"type": "manual", "issue": string}`
- **Response** (201): `Report`
- **Callers**: `reportsApi.submitManual()` at `lib/api.ts:650`

### `GET /v1/messages/threads`
- **What**: List message threads
- **Request**: Header `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "items": [{"id": string, "organization_id": string, "subject": string, "status": string, "created_by"?: string, "created_at": string, "updated_at": string, "last_message_at": string}],
    "next_cursor": null
  }
  ```
- **Callers**: `dashboardApi.messagingApi.getMessageThreads()` at `lib/api.ts:1625`

### `POST /v1/messages/threads`
- **What**: Create a new message thread
- **Request**: `{"subject": string, "message": string}`
- **Response** (201): `MessageThread` (including `id`)
- **Callers**: `dashboardApi.messagingApi.createMessageThread()` at `lib/api.ts:1663`

### `GET /v1/messages/threads/{id}/messages`
- **What**: List messages in a thread
- **Request**: Header `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "items": [{"id": string, "thread_id": string, "organization_id": string, "sender_type": string, "sender_name": string, "sender_email"?: string, "body": string, "message_type": string, "read_at"?: string, "created_at": string}],
    "next_cursor": null
  }
  ```
- **Callers**: `dashboardApi.messagingApi.getThreadMessages()` at `lib/api.ts:1643`

### `POST /v1/messages/threads/{id}/messages`
- **What**: Add a message to a thread
- **Request**: `{"message": string, "message_type"?: string}`
- **Response** (201): `Message`
- **Callers**: `dashboardApi.messagingApi.addMessageToThread()` at `lib/api.ts:1675`

### `POST /v1/messages/{id}/read`
- **What**: Mark a message as read
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `204 No Content`
- **Callers**: `dashboardApi.messagingApi.markMessageAsRead()` at `lib/api.ts:1686`

### `GET /v1/messages/unread-count`
- **What**: Get count of unread messages
- **Request**: Header `Authorization: Bearer {token}`
- **Response**: `{"unread_count": int}`
- **Callers**: `dashboardApi.messagingApi.getUnreadCount()` at `lib/api.ts:1693`

---

## CMS Service (port 9007) — routed by gateway via `/v1/cms`

### `GET /v1/cms/blog/posts`
- **What**: List published blog posts (public)
- **Request**: Query: `?search=&category=&featured=&limit=&offset=`
- **Response**:
  ```json
  [{"id": string, "title": string, "slug": string, "excerpt"?: string, "content": string, "author": string, "category": string, "featured": bool, "tags"?: [string], "image_url"?: string, "read_time"?: string, "status": string, "views": int, "published_at"?: string, "created_at": string, "updated_at": string}]
  ```
- **Callers**: `landingPagesApi.getBlogPosts()` at `lib/api.ts:1171` (direct fetch), `components/cms-dashboard.tsx:48`

### `GET /v1/cms/blog/posts/{slug}`
- **What**: Get a single blog post by slug (public)
- **Response**: Single `BlogPost` or 404
- **Error**: `{"error": {"code": "post_not_found", "message": "blog post not found"}}`
- **Callers**: `landingPagesApi.getBlogPost()` at `lib/api.ts:1223`, `app/blog/[slug]/page.tsx:61`

### `GET /v1/cms/blog/categories`
- **What**: List blog categories (public)
- **Response**: `[{"name": string, "slug": string, "color": string, "description": string}]`
- **Callers**: `landingPagesApi.getBlogCategories()` at `lib/api.ts:1247`, `app/blog/page.tsx:77`

### `POST /v1/cms/blog/subscribe`
- **What**: Subscribe email to newsletter (public)
- **Request**: `{"email": string, "preferences"?: object}`
- **Response** (201): `NewsletterSubscription`
- **Callers**: `landingPagesApi.subscribeNewsletter()` at `lib/api.ts:1268`

### `POST /v1/cms/contact/submit`
- **What**: Submit a contact form (public)
- **Request**: `{"name": string, "email": string, "company"?: string, "phone"?: string, "message": string, "inquiry_type"?: string}`
- **Response** (201): `ContactSubmission`
- **Callers**: `landingPagesApi.submitContact()` at `lib/api.ts:1289`, `app/contact/page.tsx:43` (direct fetch)

### `POST /v1/cms/sales/demo-request`
- **What**: Submit a demo request (public)
- **Request**: `{"name": string, "email": string, "company": string, "phone"?: string, "job_title"?: string, "company_size"?: string, "industry"?: string, "preferred_time"?: string, "preferred_date"?: string, "message"?: string}`
- **Response** (201): `DemoRequest`
- **Callers**: `landingPagesApi.submitDemoRequest()` at `lib/api.ts:1310`

### `POST /v1/cms/sales/quote-request`
- **What**: Submit a quote request (public)
- **Request**: `{"company_name": string, "contact_email": string, "contact_name"?: string, "phone"?: string, "requirements"?: string, "user_count"?: int, "current_solution"?: string, "budget_range"?: string, "timeline"?: string}`
- **Response** (201): `QuoteRequest`
- **Callers**: `landingPagesApi.submitQuoteRequest()` at `lib/api.ts:1328`

### `GET /v1/cms/status/services`
- **What**: Get service status list (public)
- **Response**: `[{"name": string, "status": string, "uptime_percentage": float}]`
- **Callers**: `landingPagesApi.getServiceStatus()` at `lib/api.ts:1345`

### `GET /v1/cms/status/overview`
- **What**: Get overall system status (public)
- **Response**: `{"overall_status": string, "services": [{name, status, uptime_percentage}]}`
- **Callers**: `landingPagesApi.getSystemOverview()` at `lib/api.ts:1354`

### `GET /v1/cms/help/articles`
- **What**: List help articles (public)
- **Request**: Query: `?category=&difficulty=&limit=&offset=&search=`
- **Response**: `[HelpArticle]`
- **Callers**: `landingPagesApi.getHelpArticles()` at `lib/api.ts:1366`, `components/cms-dashboard.tsx:49`

### `GET /v1/cms/help/categories`
- **What**: List help categories (public)
- **Response**: `[HelpCategory]`
- **Callers**: `landingPagesApi.getHelpCategories()` at `lib/api.ts:1378`

### `POST /v1/cms/help/articles/{id}/helpful`
- **What**: Mark an article as helpful/unhelpful (public)
- **Request**: `{"helpful": bool}`
- **Response**: `{"recorded": true}`
- **Callers**: `landingPagesApi.markArticleHelpful()` at `lib/api.ts:1383`

### `GET /v1/cms/docs`
- **What**: List documentation articles (public)
- **Request**: Query: `?category=&difficulty=&limit=&offset=&search=`
- **Response**: `[DocArticle]`
- **Callers**: `landingPagesApi.getDocumentation()` at `lib/api.ts:1390`

### `GET /v1/cms/docs/categories`
- **What**: List documentation categories (public)
- **Response**: `[DocCategory]`
- **Callers**: `landingPagesApi.getDocumentationCategories()` at `lib/api.ts:1402`

### `POST /v1/cms/analytics/track-visit`
- **What**: Track a page visit (public)
- **Request**: `{"page": string, "session_id"?: string, "ip_address"?: string, "user_agent"?: string, "referrer"?: string, "utm_source"?: string, "utm_medium"?: string, "utm_campaign"?: string}`
- **Response** (202): `{"recorded": true}`
- **Callers**: `landingPagesApi.trackVisit()` at `lib/api.ts:1407`

### `POST /v1/cms/analytics/track-event`
- **What**: Track a custom event (public)
- **Request**: `{"event_type": string, "page"?: string, "user_id"?: string, "session_id"?: string, "metadata"?: object}`
- **Response** (202): `{"recorded": true}`
- **Callers**: `landingPagesApi.trackEvent()` at `lib/api.ts:1423`

---

## WebSocket Endpoints

### `{WS_URL}/ws` (via `lib/use-websocket.ts:37`)
- **Connect**: `new WebSocket("{wsUrl}?token={token}")`
- **Purpose**: Generic WebSocket for real-time updates (currently imported but not actively used)
- **Config**: URL derived from `NEXT_PUBLIC_WS_URL` or from `NEXT_PUBLIC_API_URL` (http→ws, https→wss)

### `{WS_URL}/ws/messaging` (via `hooks/use-websocket-messaging.ts:89`)
- **Connect**: `new WebSocket("{wsProtocol}//{wsHost}/ws/messaging?token={token}")`
- **Purpose**: Real-time messaging updates (new threads, messages, read receipts)
- **Called from**: `components/cms-organizations.tsx` (with empty token — currently disabled)

---

## Health Endpoint

### `GET /v1/health`
- **What**: Health check (public)
- **Response**: `{"service": string, "status": "ok", "time": string}`
- **Used for**: Service availability monitoring (deployment health checks)

---

## Appendix: Not Implemented (stubs returning errors)

These endpoints are expected by the frontend but marked as "not available" — they return `{status: "error", message: "..."}`:

| Frontend Function | Endpoint Attempted | Reason Missing |
|---|---|---|
| `authApi.switchOrganization()` | — | JWT scope covers one org |
| `authApi.listMemberships()` | — | Memberships returned in login |
| `authApi.listMembers()` | — | Not implemented |
| `authApi.updateMemberRole()` | — | Not implemented |
| `filesApi.edit()` | — | Not implemented |
| `adminApi.listAccounts()` | — | Not implemented |
| `adminApi.createUser()` | — | Use invites instead |
| `adminApi.editUser()` | — | Not implemented |
| `adminApi.deleteUser()` | — | Not implemented |
| `apiKeysApi.delete()` | — | Use revoke instead |
| `apiKeysApi.get()` | — | Not implemented |
| `apiKeysApi.update()` | — | Not implemented |
| `apiKeysApi.getQuota()` | — | Not implemented |
| `apiKeysApi.getUsageStats()` | — | Not implemented |
| `apiKeysApi.getAuditLog()` | — | Not implemented |
| `apiKeysApi.getLlmControl()` | — | Not implemented |
| `apiKeysApi.updateLlmControl()` | — | Not implemented |
| `aiAgentApi.executeCommands()` | — | Not implemented |
| `aiAgentApi.getAvailableFiles()` | — | Not implemented |
| `aiAgentApi.fileContent()` | — | Not implemented |
| `aiAgentApi.fileById()` | — | Not implemented |
| `aiAgentApi.fuzzySearch()` | — | Not implemented |
| `aiAgentApi.kbSearch()` | — | Not implemented |
| `aiAgentApi.semanticSearch()` | — | Use queryApi instead |
| `landingPagesApi.getContactOptions()` | — | Not implemented |
| `dashboardApi.generateQuizFromDocument()` | — | Not implemented |
