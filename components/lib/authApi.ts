// lib/authApi.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export type LoginResponse = {
  id: string;
  email: string;
  username: string;
  token: string
};

export async function registerUser(
  username: string,
  email: string,
  password: string,
 
) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Failed to register");
  }

  return res.json() as Promise<LoginResponse>;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error ?? "Invalid email or password.");
  }

  return res.json() as Promise<LoginResponse>;
}
