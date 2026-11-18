/**
 * @file main.tsx
 * @description Monte l’application React et configure l’affichage des notifications.
 * @author Copilot
 * @date 2026-11-17
 * @version 1.0.0
 * @license MIT
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Élément racine introuvable dans index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" richColors />
  </StrictMode>,
)
