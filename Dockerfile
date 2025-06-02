# ==========================
# Stage 1: Build Frontend
# ==========================
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 👇 Install dev dependencies for Vite config in TypeScript
RUN npm install -D ts-node typescript

# Copy source code
COPY . .

# Pass VITE_API_URL at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build frontend
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine

WORKDIR /app

COPY backend ./backend
COPY package*.json ./
COPY --from=build-frontend /app/dist ./dist

RUN npm install --production

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "backend/Server.cjs"]
