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
  if (!API_AI) {
    throw new Error("AI API URL not configured");
  }

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

  try {
    const res = await fetch(url, opts);

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `HTTP ${res.status}`);
    }

    const text = await res.text().catch(() => "");
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`AI API request failed: ${error.message}`);
    throw error;
  }
}

export const aiApi = {
  post: async (p, b) => request("POST", p, b),
};
