const AUTH_STORAGE_KEY = "cupbet_site_auth_v1";
const AUTH_TOKEN = "4eb4022e860d61700d7f1ac28d06bd888e5059f8c8a7e5df8e241cdd8614c933";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session.token === AUTH_TOKEN ? session : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(readSession());
}

export async function login(password) {
  const hash = await sha256(password.trim());
  if (hash !== AUTH_TOKEN) {
    return { ok: false, error: "Incorrect password. Access denied." };
  }

  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token: AUTH_TOKEN,
      expiresAt: Date.now() + SESSION_MS,
      loggedInAt: new Date().toISOString(),
    })
  );

  return { ok: true };
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getSessionInfo() {
  return readSession();
}
