const API_AI = (import.meta && import.meta.env && import.meta.env.VITE_AI) || "";

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

async function request(method, path, body) {
  const url = path.startsWith("/") ? `${API_AI}${path}` : path;
  const isFormData = body instanceof FormData;
  const headers = authHeaders(isFormData);

  if (!headers) {
    throw new Error("unauthenticated");
  }

  const opts = { method, headers };
  if (body !== undefined) {
    opts.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(url, opts);

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }

  const text = await res.text().catch(() => "");
  return text ? JSON.parse(text) : null;
}

export const aiApi = {
  post: (p, b) => request("POST", p, b),
};
