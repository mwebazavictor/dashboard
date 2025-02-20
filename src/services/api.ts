// services/api.ts
import Cookies from "js-cookie";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "";

interface ErrorResponse {
  message?: string;
}

/**
 * A helper to call the refresh token endpoint.
 * Uses a direct fetch call (without auto-refresh logic) to avoid infinite loops.
 */
async function refreshAccessToken(
  refreshTokenValue: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshTokenValue }),
  });
  if (!res.ok) {
    const errorData: ErrorResponse = await res.json();
    throw new Error(errorData.message || "Failed to refresh token");
  }
  return res.json();
}

/**
 * Generic POST helper that automatically refreshes tokens on a 403 response.
 */
async function post<T>(endpoint: string, data: any, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Wrap the fetch call in a function so we can retry it
  const doRequest = async () =>
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

  let res = await doRequest();

  // If access token has expired, we expect a 403 Forbidden
  if (res.status === 403) {
    const refreshTokenValue = Cookies.get("refreshToken");
    if (!refreshTokenValue) {
      throw new Error("No refresh token available.");
    }
    try {
      // Get new tokens
      const tokenData = await refreshAccessToken(refreshTokenValue);
      // Update cookies with new tokens
      Cookies.set("accessToken", tokenData.accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", tokenData.refreshToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      // Update the header with the new access token
      headers.Authorization = `Bearer ${tokenData.accessToken}`;
      // Retry the original request
      res = await doRequest();
    } catch (err) {
      throw err;
    }
  }

  if (!res.ok) {
    const errorData: ErrorResponse = await res.json();
    throw new Error(errorData.message || "API request failed");
  }
  return res.json();
}

/**
 * Generic GET helper that automatically refreshes tokens on a 403 response.
 */
async function get<T>(endpoint: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const doRequest = async () =>
    fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

  let res = await doRequest();

  if (res.status === 403) {
    const refreshTokenValue = Cookies.get("refreshToken");
    if (!refreshTokenValue) {
      throw new Error("No refresh token available.");
    }
    try {
      const tokenData = await refreshAccessToken(refreshTokenValue);
      Cookies.set("accessToken", tokenData.accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", tokenData.refreshToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      headers.Authorization = `Bearer ${tokenData.accessToken}`;
      res = await doRequest();
    } catch (err) {
      throw err;
    }
  }

  if (!res.ok) {
    const errorData: ErrorResponse = await res.json();
    throw new Error(errorData.message || "API request failed");
  }
  return res.json();
}

// ===== Auth APIs =====

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login<T = any>({ email, password }: LoginRequest): Promise<T> {
  return post<T>("/auth/login", { email, password });
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export async function register<T = any>({
  name,
  email,
  password,
  phone,
  role,
}: RegisterRequest): Promise<T> {
  return post<T>("/auth/register", { name, email, password, phone, role });
}

export async function refreshToken<T = any>(token: string): Promise<T> {
  return post<T>("/auth/token", { token });
}

export async function logout<T = any>(token: string): Promise<T> {
  return post<T>("/auth/logout", { token });
}

// ===== Company APIs =====

export async function createCompany<T = any>(companyData: any, token: string): Promise<T> {
  return post<T>("/company", companyData, token);
}

export async function getCompany<T = any>(companyId: string, token: string): Promise<T> {
  return get<T>(`/company/${companyId}`, token);
}

export async function getAllCompanies<T = any>(token: string): Promise<T> {
  return get<T>("/company", token);
}

export async function updateCompany<T = any>(
  companyId: string,
  companyData: any,
  token: string
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/company/${companyId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(companyData),
  });
  if (!res.ok) {
    const errorData: ErrorResponse = await res.json();
    throw new Error(errorData.message || "API request failed");
  }
  return res.json();
}

// ===== Agents APIs =====

export async function createAgent<T = any>(agentData: any, token: string): Promise<T> {
  return post<T>("/agents", agentData, token);
}

export async function getAgents<T = any>(token: string): Promise<T> {
  return get<T>("/agents", token);
}

export async function getAgent<T = any>(agentId: string, token: string): Promise<T> {
  return get<T>(`/agents/${agentId}`, token);
}

export async function updateAgent<T = any>(
  agentId: string,
  agentData: any,
  token: string
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/agents/${agentId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(agentData),
  });

  if (!res.ok) {
    const errorData: ErrorResponse = await res.json();
    throw new Error(errorData.message || "API request failed");
  }
  return res.json();
}

// ===== Purchased Agents API =====

export async function purchaseAgent<T = any>(purchaseData: any): Promise<T> {
  return post<T>("/purchasedagents", purchaseData);
}

export async function purchaseAgentWithAccount<T = any>(
  purchaseData: {
    company_id: string;
    plan: string;
    amount: string;
    period: number;
    agent_id: string;
  },
  token: string
): Promise<T> {
  return post<T>("/purchasedagents/withacount", purchaseData, token);
}

export async function getPurchasedAgents<T = any>(
  companyId: string,
  token: string
): Promise<T> {
  return get<T>(`/purchasedagents/withcompayid/${companyId}`, token);
}

// =========Uploading Document Route ==================
export async function uploadDocument(file: File, userId: string, companyId: string, token: string): Promise<any> {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("user_id", userId);
  formData.append("company_id", companyId);

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers, // No need to set "Content-Type", it will be automatically set by FormData
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "File upload failed");
  }

  return res.json();
}

// ===== Company APIs =====

/**
 * Registers a new company without requiring an authorization token.
 *
 * Endpoint:
 * POST https://multi-agents-production.up.railway.app/api/v1/company
 *
 * Payload:
 * {
 *   "companyname": "Tubayo",
 *   "companyemail": "bobii@gmail.com",
 *   "companylocation": "Nakawa",
 *   "industry": "software enterprise",
 *   "name": "Ssendegeya Albert",
 *   "email": "bobii@gmail.com",
 *   "password": "123456",
 *   "phone": "0786567850",
 *   "role": "admin"
 * }
 *
 * Note: No bearer token is required.
 */
export async function registerCompany<T = any>(companyData: any): Promise<T> {
  // We omit the token parameter since this route doesn't require authorization.
  return post<T>("/company", companyData);
}
