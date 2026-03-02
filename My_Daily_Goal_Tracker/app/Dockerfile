FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
# Vite usually needs to be exposed on 5173
EXPOSE 5173

# On ne fait le COPY et le npm install QUE si on a un projet prêt
# Pour l'instant, on peut juste dire au conteneur de rester allumé
CMD ["sh", "-c", "npm install && npm run dev"]
