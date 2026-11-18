import type { CookieOptions, Request, Response } from 'express';

export const AUTH_COOKIE_NAME = 'daily-goal-token';

const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error(
      'JWT_SECRET is required and must contain at least 32 bytes. Generate one with: openssl rand -base64 48',
    );
  }

  return secret;
}

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  };
}

export function clearAuthCookie(res: Response): void {
  const { maxAge: _maxAge, ...options } = getAuthCookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
}

export function readAuthToken(req: Request): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookiePrefix = `${AUTH_COOKIE_NAME}=`;
  const cookie = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(cookiePrefix));

  return cookie?.slice(cookiePrefix.length);
}
