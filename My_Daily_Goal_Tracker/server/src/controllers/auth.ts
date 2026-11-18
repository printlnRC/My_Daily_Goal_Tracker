import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import type { AuthRequest } from '../Middlewares/auth.js';
import { AUTH_COOKIE_NAME, clearAuthCookie, getAuthCookieOptions, getJwtSecret } from '../lib/auth.js';

export const authController = {
  // Inscription
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      // 1. Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }

      // 2. Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Sauvegarder l'utilisateur
      const user = await prisma.user.create({
        data: { email, password: hashedPassword }
      });

      // 4. Générer le token JWT
      const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '7d' });

      res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
      res.status(201).json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création du compte." });
    }
  },

  // Connexion
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Identifiants invalides." });
      }

      // Comparer le mot de passe envoyé avec le hash en base
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Identifiants invalides." });
      }

      const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '7d' });
      res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la connexion." });
    }
  },

  me: async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true },
      });

      if (!user) {
        clearAuthCookie(res);
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
      }

      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la vérification de la session.' });
    }
  },

  logout: (_req: Request, res: Response) => {
    clearAuthCookie(res);
    return res.status(204).end();
  },
};