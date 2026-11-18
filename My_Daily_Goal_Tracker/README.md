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