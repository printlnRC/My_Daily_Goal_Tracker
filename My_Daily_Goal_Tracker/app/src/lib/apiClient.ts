/**
 * @file apiClient.ts
 * @description Centralise les requêtes HTTP vers l’API et la gestion des erreurs de session.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  skipUnauthorizedHandler?: boolean;
};

type ApiErrorResponse = {
  error?: string;
};

let unauthorizedHandler: (() => void) | undefined;

export function setUnauthorizedHandler(handler: (() => void) | undefined): void {
  unauthorizedHandler = handler;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {},
): Promise<T> {
  const endpoint = `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
  const response = await fetch(endpoint, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401 && !options.skipUnauthorizedHandler) {
    unauthorizedHandler?.();
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    const errorData: ApiErrorResponse = contentType.includes('application/json')
      ? await response.json() as ApiErrorResponse
      : {};
    throw new ApiError(
      errorData.error || `Erreur API (HTTP ${response.status}).`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}
