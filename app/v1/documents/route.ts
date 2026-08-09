import { NextRequest } from "next/server"

// Dedicated handler for the exact /v1/documents path (not /v1/documents/{id}
// - that still falls through to next.config.mjs's generic rewrite, which is
// fine since only ingest is slow). Real filesystem routes like this one take
// precedence over the array-form rewrites() rule, so this doesn't require
// any change there - it just intercepts this one path before the rewrite
// ever sees it.
//
// Why this exists: POST here triggers document ingest, which chunks and
// embeds the content server-side. For large documents that can take minutes,
// well past whatever timeout Next.js's internal fetch uses for rewrites -
// the browser would see a bare "500 Internal Server Error" (not JSON) long
// before the backend actually finishes. Proxying manually here lets us set
// an explicit, generous timeout instead.
//
// BACKEND_URL is read at request time (this is a server-side Route Handler,
// not next.config.mjs - it isn't evaluated at build time), same in-network
// edge-gateway address used everywhere else.
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000 // matches knowledge-service's ingest persist-phase bound

async function proxy(req: NextRequest, method: "GET" | "POST"): Promise<Response> {
  const backendUrl = (process.env.BACKEND_URL || "http://localhost:9001").replace(/\/$/, "")
  const targetUrl = `${backendUrl}/v1/documents${req.nextUrl.search}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)

  try {
    const headers: Record<string, string> = {
      "Content-Type": req.headers.get("content-type") || "application/json",
    }
    const auth = req.headers.get("authorization")
    if (auth) headers["Authorization"] = auth
    const requestId = req.headers.get("x-request-id")
    if (requestId) headers["X-Request-ID"] = requestId

    const response = await fetch(targetUrl, {
      method,
      headers,
      body: method === "POST" ? await req.text() : undefined,
      signal: controller.signal,
    })

    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    })
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError"
    return Response.json(
      {
        error: {
          code: timedOut ? "upload_timeout" : "upstream_unavailable",
          message: timedOut
            ? `Upload did not complete within ${UPLOAD_TIMEOUT_MS / 1000}s`
            : "Failed to reach the backend",
        },
      },
      { status: timedOut ? 504 : 502 },
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET")
}

export async function POST(req: NextRequest) {
  return proxy(req, "POST")
}
