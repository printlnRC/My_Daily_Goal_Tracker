## Configuration du serveur

Si `server/.env` n’existe pas, copiez `server/.env.example` vers `server/.env`.
Sinon, ajoutez-y les variables manquantes sans écraser sa configuration existante.
Renseignez `DATABASE_URL`.
Générez un secret JWT aléatoire d’au moins 32 octets avec `openssl rand -base64 48`
et placez le résultat dans `JWT_SECRET`. Le serveur refuse de démarrer si ce secret
est absent ou trop court. `server/.env` est ignoré par Git : ne publiez jamais ce secret.

En production, configurez `CLIENT_ORIGIN` avec l’origine HTTPS exacte de l’application.
Les sessions sont transmises dans un cookie `HttpOnly`, et non dans `localStorage`.

En développement, lancez le backend avec `cd server && npm run dev` et le frontend
avec `cd app && npm run dev`. Vite relaie les requêtes `/api` vers le backend sur le
port 5000 ; si l’API est arrêtée, la connexion ne peut pas aboutir.

## Badges hebdomadaires

Les coches des objectifs sont enregistrées par semaine. Le dimanche à 23 h 59 min 59 s,
heure de Paris, le serveur calcule le taux de réalisation et attribue au plus un badge :
25 %, 50 %, 75 % ou 100 % (le palier le plus élevé atteint). Les comptes de badges sont
consultables dans l’espace utilisateur. Le serveur tente aussi de rattraper une attribution
manquée au redémarrage lorsqu’il possède déjà des occurrences enregistrées pour la semaine.

Après mise à jour du schéma, sauvegardez la base puis appliquez la migration depuis le dossier
`server` avec `npx prisma migrate deploy`. Pour Docker, exécutez cette commande dans le
conteneur backend avant d’utiliser les routes de badges.