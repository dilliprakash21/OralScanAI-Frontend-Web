const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token: string) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as any),
  };

  // Only set JSON content-type if body is not FormData
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  auth: {
    signup: (payload: any) => request<{ ok: boolean; message: string }>("/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload: any) => request<{ token: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    me: () => request<{ user: any; profile: any }>("/auth/me"),
    verifyPassword: (payload: any) => request<{ ok: boolean }>("/auth/verify-password", { method: "POST", body: JSON.stringify(payload) }),
    verifySignup: (payload: { email: string; code: string }) => request<{ ok: boolean; token: string; user: any }>("/auth/verify-signup", { method: "POST", body: JSON.stringify(payload) }),
    forgotPassword: (payload: { email: string }) => request<{ ok: boolean; message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
    resetPassword: (payload: any) => request<{ ok: boolean; message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
    changePassword: (payload: any) => request<{ ok: boolean; message: string }>("/auth/change-password", { method: "POST", body: JSON.stringify(payload) }),
  },
  profile: {
    update: (payload: any) => request<{ profile: any }>("/profiles/me", { method: "PUT", body: JSON.stringify(payload) }),
    uploadAvatar: (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      return request<{ avatar_url: string }>("/profiles/me/avatar", { method: "POST", body: fd });
    }
  },
  screenings: {
    create: (payload: any) => request<{ screening: any }>("/screenings", { method: "POST", body: JSON.stringify(payload) }),
    list: (params: { limit?: number; q?: string; from?: string; to?: string } = {}) => {
      const usp = new URLSearchParams();
      if (params.limit) usp.set("limit", String(params.limit));
      if (params.q) usp.set("q", params.q);
      if (params.from) usp.set("from", params.from);
      if (params.to) usp.set("to", params.to);
      const qs = usp.toString();
      return request<{ screenings: any[] }>(`/screenings${qs ? `?${qs}` : ""}`);
    },
    get: (id: string) => request<{ screening: any }>(`/screenings/${id}`),
    stats: () => request<{ stats: any }>("/screenings/stats"),
  },
  notifications: {
    list: () => request<{ notifications: any[] }>("/notifications"),
    markAllRead: () => request<{ ok: boolean }>("/notifications/mark-all-read", { method: "POST" }),
  },
};

export { getToken, setToken, clearToken };
