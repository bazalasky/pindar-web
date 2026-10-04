import { getToken } from '../auth/tokenStorage';
import type { Activity } from './types';

const BASE_URL = import.meta.env.VITE_API_URL;

/** Collapses Nest's two error body shapes into one readable string. */
function errorMessage(body: unknown, status: number): string {
  const message = (body as { message?: unknown })?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return `Request failed with status ${status}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;


    const res = await fetch(`${BASE_URL}${path}`, {...options, headers});
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(errorMessage(body, res.status));
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

export function login(email: string, password: string) {
  return request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getActivities() {
  return request<Activity[]>('/activities')
}
