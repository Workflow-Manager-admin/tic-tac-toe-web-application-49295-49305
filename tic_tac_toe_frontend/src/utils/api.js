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

/**
 * Fetch list of open and current games for the user.
 * Returns list of games or {error}
 */
// PUBLIC_INTERFACE
export async function fetchGames(token) {
  try {
    const resp = await fetch(`${API_BASE}/games`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Fetch history of played games for the user.
 * Returns list of games or {error}
 */
// PUBLIC_INTERFACE
export async function fetchGameHistory(token) {
  try {
    const resp = await fetch(`${API_BASE}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Create a new game and return game details.
 * Returns game info or {error}
 */
// PUBLIC_INTERFACE
export async function createGame(token) {
  try {
    const resp = await fetch(`${API_BASE}/games`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Join an existing game by game ID.
 * Returns the joined game info or {error}
 */
// PUBLIC_INTERFACE
export async function joinGame(token, gameId) {
  try {
    const resp = await fetch(`${API_BASE}/games/${gameId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Make a move in an active game.
 * move = { x: Number, y: Number }
 * Returns updated game state or {error}
 */
// PUBLIC_INTERFACE
export async function makeMove(token, gameId, move) {
  try {
    const resp = await fetch(`${API_BASE}/games/${gameId}/move`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(move),
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}

/**
 * Fetch the current state of a specific game.
 * Returns game state or {error}
 */
// PUBLIC_INTERFACE
export async function fetchGameState(token, gameId) {
  try {
    const resp = await fetch(`${API_BASE}/games/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse(resp);
  } catch (e) {
    return { error: e.toString() };
  }
}
