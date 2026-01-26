FROM node:20-alpine

WORKDIR /app

# On ne fait le COPY et le npm install QUE si on a un projet prêt
# Pour l'instant, on peut juste dire au conteneur de rester allumé
CMD ["sh", "-c", "npm install && npm run dev"]
