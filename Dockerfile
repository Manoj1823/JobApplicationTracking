# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app

# Copy package files, Vite config, tsconfig files, and index.html
COPY package*.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html ./

# Copy frontend source code
COPY src ./src

RUN npm install
RUN npm run build

# Stage 2: Backend build and runtime
FROM node:18-alpine

WORKDIR /app

# Copy backend source code
COPY backend ./backend

# Copy package files for backend dependencies
COPY package*.json ./

# Copy frontend build output from previous stage
COPY --from=build-frontend /app/dist ./dist

# Install backend dependencies only (production)
RUN npm install --production

# Expose backend port
EXPOSE 5000

ENV NODE_ENV=production

# Start the backend server (which also serves the frontend)
CMD ["node", "backend/Server.cjs"]
