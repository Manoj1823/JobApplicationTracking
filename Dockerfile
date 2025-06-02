# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app

# Copy frontend files and env
COPY package*.json vite.config.ts tsconfig.json ./
COPY .env .env
COPY src ./src

# Install and build
RUN npm install
RUN npm run build

# Stage 2: Backend build and runtime
FROM node:18-alpine

WORKDIR /app

# Copy backend code
COPY backend ./backend

# Copy backend env file
COPY .env .env

# Copy backend package files
COPY package*.json ./

# Copy frontend build output
COPY --from=build-frontend /app/dist ./dist

# Install only backend dependencies
RUN npm install --production

# Expose backend port
EXPOSE 5000

# Run the server (which also serves frontend)
CMD ["node", "backend/Server.cjs"]
