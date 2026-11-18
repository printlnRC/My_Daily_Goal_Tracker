# Arborescence du projet

```text
My_Daily_Goal_Tracker/
├── app/                              # Application frontend React + TypeScript
│   ├── src/
│   │   ├── components/               # Composants de l’interface
│   │   │   ├── AccountPage.tsx       # Espace utilisateur et statistiques
│   │   │   ├── GoalForm.tsx          # Formulaire de création d’objectif
│   │   │   ├── GoalGet.tsx           # Liste des objectifs
│   │   │   ├── GoalGraph.tsx         # Graphique des objectifs
│   │   │   └── Header.tsx            # En-tête et navigation
│   │   ├── lib/
│   │   │   └── schemas.ts            # Schémas de validation Zod
│   │   ├── picture/                  # Badges illustrés de l’application
│   │   ├── types/                    # Types TypeScript partagés dans le frontend
│   │   │   ├── goal.ts
│   │   │   ├── goalGrap.ts
│   │   │   └── goalget.ts
│   │   ├── App.tsx                   # Authentification et vues principales
│   │   ├── index.css                 # Styles globaux et configuration Tailwind/DaisyUI
│   │   └── main.tsx                  # Point d’entrée React
│   ├── Dockerfile                    # Image Docker du frontend
│   ├── eslint.config.js              # Configuration ESLint
│   ├── index.html                    # Document HTML principal
│   ├── package.json                  # Dépendances et scripts du frontend
│   ├── package-lock.json             # Versions verrouillées du frontend
│   └── vite.config.js                # Configuration Vite et proxy API
├── server/                           # API backend Express + TypeScript
│   ├── prisma/
│   │   ├── migrations/               # Migrations de la base de données
│   │   │   └── 20260201215714_init_goals/
│   │   │       └── migration.sql
│   │   ├── schema.prisma             # Modèles User et Goal
│   │   └── seed.ts                   # Données initiales
│   ├── src/
│   │   ├── controllers/              # Traitement des requêtes HTTP
│   │   │   ├── auth.ts               # Inscription, connexion et session
│   │   │   ├── goalController.ts     # Création et gestion des objectifs
│   │   │   └── goalGraph.ts          # Données des graphiques
│   │   ├── lib/
│   │   │   ├── auth.ts               # Cookie de session et configuration JWT
│   │   │   └── prisma.ts             # Client Prisma
│   │   ├── Middlewares/
│   │   │   └── auth.ts               # Vérification de l’authentification
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # Routes d’authentification
│   │   │   └── goalRoutes.ts         # Routes des objectifs
│   │   ├── services/
│   │   │   ├── goalGet.ts            # Accès aux objectifs en base
│   │   │   └── goalGraph.ts          # Requêtes de statistiques
│   │   └── index.ts                  # Démarrage du serveur Express
│   ├── .env.example                  # Modèle des variables d’environnement
│   ├── .gitignore                    # Exclusion des fichiers locaux et générés
│   ├── Dockerfile                    # Image Docker du backend
│   ├── package.json                  # Dépendances et scripts du backend
│   ├── package-lock.json             # Versions verrouillées du backend
│   ├── prisma.config.ts              # Configuration Prisma
│   └── tsconfig.json                 # Configuration TypeScript
├── .gitignore                        # Exclusions Git à la racine
├── docker-compose.yml                # Services frontend, backend et PostgreSQL
├── package.json                      # Dépendances racine
├── package-lock.json                 # Versions verrouillées à la racine
└── README.md                         # Configuration et démarrage du projet
```

Les fichiers `.env` locaux ne sont pas listés : ils contiennent des valeurs
privées et ne doivent pas être ajoutés au dépôt. Le fichier `server/.env.example`
sert de modèle sans contenir de secrets.
