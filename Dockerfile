# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app

# Accept build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy frontend source files
COPY package*.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html ./
COPY src ./src

RUN npm install
RUN npm install -D ts-node typescript
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
