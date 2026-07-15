# --- Etapa 1: Construcción (Build) ---
# Usamos una versión específica LTS de Node.js sobre Alpine Linux para asegurar estabilidad y ligereza
FROM node:24.18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de manera limpia (evitando cambios de lockfile)
RUN npm ci

# Declarar los argumentos de construcción (Build Args) requeridos por el bundler (ej: Vite)
ARG VITE_API_URL
# Transferir el argumento a una variable de entorno para que el compilador la detecte
ENV VITE_API_URL=$VITE_API_URL

# Copiar el resto del código fuente del frontend
COPY . .

# Compilar el proyecto para producción (genera la carpeta dist/ o build/)
RUN npm run build

# --- Etapa 2: Servidor Web de Producción (Nginx) ---
FROM nginx:1.25-alpine

# Limpiar la configuración por defecto y los archivos predeterminados de Nginx
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copiar nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos compilados desde la etapa anterior
# Nota: Cambia "dist" por "build" si tu bundler no es Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer los puertos necesarios
EXPOSE 80
EXPOSE 443

# Ejecutar Nginx en primer plano (foreground) para mantener el contenedor activo
CMD ["nginx", "-g", "daemon off;"]