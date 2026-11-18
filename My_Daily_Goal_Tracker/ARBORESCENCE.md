# Arborescence du projet

```text
My_Daily_Goal_Tracker/
├── app/
│   ├── src/
│   │   ├── assets/badges/                    # Illustrations de badges
│   │   ├── components/
│   │   │   ├── layout/Header.tsx             # En-tête et navigation connectée
│   │   │   └── ui/PriorityBadge.tsx          # Badge de priorité réutilisable
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/               # Formulaires connexion et inscription
│   │   │   │   ├── hooks/useAuth.ts          # Session et actions d’authentification
│   │   │   │   ├── schemas/auth.schemas.ts    # Validation des identifiants
│   │   │   │   ├── services/authService.ts   # Appels API d’authentification
│   │   │   │   └── types/auth.types.ts       # Types d’authentification
│   │   │   └── goals/
│   │   │       ├── components/               # Formulaire, liste et graphique
│   │   │       ├── context/GoalsContext.tsx  # État partagé des objectifs
│   │   │       ├── hooks/                    # CRUD et statistiques hebdomadaires
│   │   │       ├── schemas/                  # Validation des objectifs
│   │   │       ├── services/goalService.ts   # Appels API des objectifs
│   │   │       └── types/                    # Types objectifs et graphique
│   │   ├── lib/apiClient.ts                  # Fetch, cookies et erreurs HTTP
│   │   ├── pages/                            # AuthPage, DashboardPage, AccountPage
│   │   ├── App.tsx                           # Session et sélection de page
│   │   ├── index.css
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── tsconfig.json                         # Vérification TypeScript
│   ├── package.json
│   └── vite.config.js                        # Proxy API configurable
├── server/
│   ├── prisma/                               # Schéma, migrations et seed Prisma
│   ├── src/
│   │   ├── controllers/                      # Contrôleurs auth, objectifs et graphique
│   │   ├── lib/                              # Authentification et Prisma
│   │   ├── middlewares/auth.middleware.ts
│   │   ├── routes/                           # auth.routes et goal.routes
│   │   ├── services/                         # goal.service et goalGraph.service
│   │   └── index.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml                        # Frontend, API et PostgreSQL
├── README.md
└── ARBORESCENCE.md
```

Les fichiers `.env` locaux ne sont pas listés : ils contiennent des valeurs
privées et ne doivent pas être ajoutés au dépôt. `server/.env.example` sert de
modèle sans secret.
