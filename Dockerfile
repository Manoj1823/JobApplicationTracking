# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app

# Copy only frontend relevant files for dependency install and build
COPY package*.json vite.config.ts tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

# Stage 2: Backend build and runtime
FROM node:18-alpine

WORKDIR /app

# Copy backend source code and package files for backend install
COPY backend ./backend
COPY package*.json ./

# Copy frontend build output from previous stage
COPY --from=build-frontend /app/dist ./dist

# Install backend production dependencies only
RUN npm install --production

# Expose port
EXPOSE 5000

# Run backend server
CMD ["node", "backend/Server.cjs"]
