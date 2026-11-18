import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { clearAuthCookie, getJwtSecret, readAuthToken } from '../lib/auth.js';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = readAuthToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Session manquante.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === 'string' || typeof payload.userId !== 'number') {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'Session invalide ou expirée.' });
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    clearAuthCookie(res);
    return res.status(401).json({ error: 'Session invalide ou expirée.' });
  }
};
