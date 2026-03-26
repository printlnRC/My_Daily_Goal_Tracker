# 🚀 My Daily Goal Tracker - Procédure de Lancement

Ce projet utilise Docker Compose pour orchestrer le frontend (React), le backend (Node.js) et la base de données (PostgreSQL). Prisma est utilisé comme ORM.

## 📋 Prérequis

- Docker et Docker Compose installés.
- (Optionnel) Node.js v22 installé localement avec nvm pour la gestion des dépendances.

## 🛠️ Démarrage rapide (Première installation)

Si c'est la première fois que tu lances le projet sur ce PC ou si tu as supprimé les volumes, suis ces étapes :

### 1. Lancer les conteneurs

Cette commande construit les images et démarre les services en arrière-plan.

```bash
docker compose up -d --build
```

### 2. Générer le client Prisma

Indispensable pour que le serveur Node.js puisse communiquer avec la base de données. Cette commande crée les types TypeScript nécessaires.

```bash
docker compose exec server npx prisma generate
```

### 3. Synchroniser la base de données

Cette commande crée les tables (Goal, etc.) dans PostgreSQL en fonction de ton fichier schema.prisma.

```bash
docker compose exec server npx prisma db push
```

### 4. Redémarrer le serveur

Après la génération du client et la synchronisation, un redémarrage du service serveur est souvent nécessaire pour valider les changements.

```bash
docker compose restart server
```

## 🔍 Commandes Utiles

### Voir les logs en temps réel

Si l'application ne répond pas, vérifie les erreurs ici :

```bash
docker compose logs -f server
```

### Accéder à l'interface de la base de données (Prisma Studio)

Pour voir tes données directement dans le navigateur :

```bash
docker compose exec server npx prisma studio --browser none
```

Accessible ensuite sur : http://localhost:5555

### Tout arrêter et nettoyer

```bash
docker compose down -v
```

(Le flag `-v` supprime aussi les données de la base de données pour repartir à zéro).

## ⚠️ Dépannage fréquent

### Erreur : "SyntaxError: ... @prisma/client"

**Cause :** Le client Prisma n'est pas compatible avec l'environnement Linux du conteneur.

**Solution :** Lancez `docker compose exec server npx prisma generate`.

### Erreur : "Failed to fetch" ou "ERR_EMPTY_RESPONSE"

**Cause :** Le serveur a crashé ou ne répond pas sur le port 5000.

**Solution :** Vérifiez les logs avec `docker compose logs -f server` et assurez-vous que `db push` a été effectué.
