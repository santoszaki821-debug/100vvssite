'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export type SessionUser = { id: string; username: string; role: string };

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('100vvs.token');
}

export function saveSession(accessToken: string, user: SessionUser) {
  localStorage.setItem('100vvs.token', accessToken);
  localStorage.setItem('100vvs.user', JSON.stringify(user));
}

export function readUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('100vvs.user');
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur reseau' }));
    throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message);
  }
  return response.json();
}
