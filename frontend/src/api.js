const KEY = 'token'

export const getToken = () => sessionStorage.getItem(KEY)
export const clearToken = () => sessionStorage.removeItem(KEY)

export async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    clearToken()
    window.dispatchEvent(new Event('logout'))
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(typeof err.detail === 'string' ? err.detail : 'কিছু একটা ভুল হয়েছে')
  }
  return res.status === 204 ? null : res.json()
}

export async function login(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || 'লগইন ব্যর্থ')
  sessionStorage.setItem(KEY, data.access_token)
}