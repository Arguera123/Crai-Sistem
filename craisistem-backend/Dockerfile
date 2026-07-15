# --- ETAPA 1: Compilación (Build) ---
FROM node:20.11-alpine AS builder

WORKDIR /app

# En esta etapa sí necesitamos TODAS las dependencias (incluyendo TypeScript en devDependencies)
COPY package*.json tsconfig.json ./
RUN npm ci

# Copiar el código fuente y compilar
COPY . .
RUN npm run build


# --- ETAPA 2: Imagen de Producción (Ligera y segura) ---
FROM node:20.11-alpine

ENV NODE_ENV=production

WORKDIR /app

# Aplicar permisos de seguridad para el usuario no-root
RUN chown node:node /app
USER node

# Copiar definiciones de dependencias
COPY --chown=node:node package*.json ./

# Instalar ÚNICAMENTE dependencias de producción (sin devDependencies de TS)
RUN npm ci --only=production

# ¡La magia! Copiar la carpeta 'dist' ya compilada desde la ETAPA 1 (builder)
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]