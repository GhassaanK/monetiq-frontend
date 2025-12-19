const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND) || "";

export async function signup({ name, email, password }) {
  const url = API_BASE ? `${API_BASE}/api/users/register` : "/api/users/register";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    let message = "Registration failed";

    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // backend returned empty body
    }

    throw new Error(message);
  }

  return response.json();
}


export async function login({ email, password }) {
  const url = API_BASE ? `${API_BASE}/api/users/login` : "/api/users/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }

  return response.json();
}
