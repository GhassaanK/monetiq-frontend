const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND) || "";

function authHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isFormData) {
    return { Authorization: `Bearer ${token}` };
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function request(method, path, body, options = {}) {
  const url = path.startsWith("/") && API_BASE ? `${API_BASE}${path}` : path;
  const isFormData = body instanceof FormData;
  const headers = authHeaders(isFormData);

  const toast =
    typeof window !== "undefined" && window.__SHOW_TOAST__
      ? window.__SHOW_TOAST__
      : null;

  if (!headers) {
    toast && toast("You must be logged in to perform this action", { type: "error" });
    throw new Error("unauthenticated");
  }

  const opts = {
    method,
    headers,
    ...options,
  };

  if (body !== undefined) {
    opts.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(url, opts);

  if (res.status === 401) {
    toast && toast("Unauthorized action", { type: "error" });
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    const err = new Error(txt || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const text = await res.text().catch(() => "");
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: (p) => request("GET", p),
  post: (p, b) => request("POST", p, b),
  put: (p, b) => request("PUT", p, b),
  del: (p) => request("DELETE", p),
};

export default api;
