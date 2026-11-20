const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').replace(
  /\/+$/,
  '',
)

/** Normalized API error. `status` 0 = network failure. */
export class ApiError extends Error {
  constructor(message, { status = 0, details = [], data = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    this.data = data
  }
}

// ---- In-memory access token (never persisted → not readable from storage by XSS) ----
let accessToken = null
const listeners = new Set()

export const tokenStore = {
  get: () => accessToken,
  set(token) {
    accessToken = token || null
    listeners.forEach((fn) => fn(accessToken))
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}

let onSessionExpired = () => {}
export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn
}

// Single-flight refresh so concurrent 401s trigger one /auth/refresh.
let refreshPromise = null
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => null)
        if (!res.ok || !body?.data?.accessToken) {
          tokenStore.set(null)
          return null
        }
        tokenStore.set(body.data.accessToken)
        return body.data
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function request(method, path, { body, headers = {}, raw = false, retry = true, signal } = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const init = {
    method,
    credentials: 'include',
    signal,
    headers: {
      Accept: raw ? 'text/html' : 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }

  let res
  try {
    res = await fetch(url, init)
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new ApiError('Unable to reach the server. Check your connection and try again.')
  }

  if (res.status === 401 && retry && !path.startsWith('/auth/')) {
    const session = await refreshSession()
    if (session) return request(method, path, { body, headers, raw, retry: false, signal })
    onSessionExpired()
  }

  if (raw && res.ok) return res.text()

  const json = await res.json().catch(() => null)
  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, {
      status: res.status,
      details: json?.errors || json?.error?.details || [],
      data: json,
    })
  }
  return json
}

/** Returns `data` from the `{success, data, meta}` envelope. */
const unwrap = (p) => p.then((j) => j?.data ?? j)

export const api = {
  get: (path, opts) => unwrap(request('GET', path, opts)),
  /** Returns `{ data, meta }` for paginated lists. */
  list: (path, opts) => request('GET', path, opts).then((j) => ({ data: j?.data ?? [], meta: j?.meta ?? null })),
  post: (path, body, opts) => unwrap(request('POST', path, { ...opts, body })),
  put: (path, body, opts) => unwrap(request('PUT', path, { ...opts, body })),
  patch: (path, body, opts) => unwrap(request('PATCH', path, { ...opts, body })),
  delete: (path, opts) => unwrap(request('DELETE', path, opts)),
  html: (path, opts) => request('GET', path, { ...opts, raw: true }),
}

/** Back-compat helper used by existing hooks. */
export const apiGet = (path, options) => api.get(path, options)

export function toQuery(params = {}) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
  })
  const s = sp.toString()
  return s ? `?${s}` : ''
}

export { API_BASE_URL }
