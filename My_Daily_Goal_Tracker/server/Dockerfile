FROM node:22

# 1. Installation d'OpenSSL (on est sur Debian sans Alpine)
RUN apt-get update && apt-get install -y openssl

WORKDIR /server

# 2. Copie des fichiers de dépendances
COPY package*.json ./

# 3. Installation de TOUTES les dépendances (y compris devDependencies)
RUN npm install

# 4. Copie du reste du code
COPY . .

# 5. On ajoute le dossier .bin des node_modules au PATH
ENV PATH /server/node_modules/.bin:$PATH

EXPOSE 5000

CMD ["npm", "run", "dev"]