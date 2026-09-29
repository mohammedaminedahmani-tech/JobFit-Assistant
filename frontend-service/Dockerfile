# ===== Étape 1 : compilation du React =====
FROM node:22-alpine AS build
WORKDIR /app

# D'abord les dépendances (mises en cache)
COPY package.json package-lock.json ./
RUN npm ci

# Puis le code, et on construit le dossier dist/
COPY . .
RUN npm run build

# ===== Étape 2 : service des fichiers avec Nginx =====
# Version "unprivileged" : Nginx tourne sans les droits root
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080