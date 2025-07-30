const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

/**
 * Basic helper to handle responses
 */
async function handleResponse(resp) {
  if (!resp.ok) {
    let errorMsg = "Unknown error";
    try {
      const j = await resp.json();
      throw (j.error || j.detail || errorMsg);
    } catch {
      throw errorMsg;
    }
  }
  return resp.json();
}

// PUBLIC_INTERFACE
export async function loginAPI(username, password) {
  /**
   * Logs user in; returns {token, user} or {error}
   */
  try {
    const resp = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

// PUBLIC_INTERFACE
export async function registerAPI(username, password) {
  /**
   * Registers user; returns {token, user} or {error}
   */
  try {
    const resp = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

// PUBLIC_INTERFACE
export async function getMeAPI(token) {
  /**
   * Gets current user from token
   */
  try {
    const resp = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.status === 401) return null;
    return await handleResponse(resp);
  } catch (e) {
    return null;
  }
}

// (Stubs for game and history APIs for future use)
export async function fetchGames(token) { /* TODO */ }
export async function fetchGameHistory(token) { /* TODO */ }
export async function createGame(token) { /* TODO */ }
export async function makeMove(token, gameId, move) { /* TODO */ }
