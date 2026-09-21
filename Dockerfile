# ==============================================================================
# DOCKERFILE ENTORNO PRODUCCIÓN - FRONTEND WEB (Next.js 15)
# Ronda Vive — Alcaldía de Montería • Secretaría de Cultura
# ==============================================================================

# 1. Etapa de Construcción (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos de dependencias del Monorepo
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/

# Instalar dependencias del proyecto
RUN npm ci

# Copiar código fuente de la aplicación Web Next.js
COPY apps/web ./apps/web

# Argumentos de compilación para Next.js
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ARG NEXT_PUBLIC_WEB_URL=http://localhost:3000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WEB_URL=$NEXT_PUBLIC_WEB_URL

# Compilar la aplicación Next.js para producción
RUN npm run build --workspace @ronda-vive/web

# ------------------------------------------------------------------------------
# 2. Etapa de Ejecución en Producción (Runner - Imagen Ultra Ligera)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copiar paquetes manifiesto
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

# Copiar artefactos y módulos compilados desde la etapa builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web

# Puerto de escucha del Frontend Next.js
EXPOSE 3000

# Comando de inicio del servidor web Next.js en producción
CMD ["npm", "run", "start", "--workspace", "@ronda-vive/web"]
