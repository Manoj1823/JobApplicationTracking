# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app

# Copy package files for frontend dependencies
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY src ./src

# Install deps and build frontend
RUN npm install
RUN npm run build

# Stage 2: Build backend image
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend ./backend
COPY package*.json ./

# Copy frontend build output from previous stage
COPY --from=build-frontend /app/dist ./dist

# Install backend dependencies
RUN npm install --production

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/Server.cjs"]
