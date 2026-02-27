const BASE = 'http://localhost:4500/api/auth'


export async function fetchJSON(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)

  if (!res.ok) {
    let msg = res.statusText

    try {
      const body = await res.json()
      if (Array.isArray(body?.errors)) {
        msg = body.errors[0].msg
      }
      else if (typeof body?.errors === "string") {
        msg = body.errors
      }
      else if (body?.message) {
        msg = body.message
      }
      else {
        msg = JSON.stringify(body)
      }
    } catch (e) { }
    throw new Error(msg)
  }
  return res.json()
}

export async function login({ email, password }) {
  return fetchJSON('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
}

export async function signup({ name, email, password }) {
  return fetchJSON('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
}

export default {
  fetchJSON,
  login,
  signup
}


export const logout = async () => {
  return fetchJSON('/logout', {
    method: 'POST',
    credentials: 'include',
  })
}