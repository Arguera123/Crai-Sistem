# --- Compilación (Build) ---
FROM node:20.11-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Imagen de Producción ---
FROM node:20.11-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]