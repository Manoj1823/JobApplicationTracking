# Stage 1: Build frontend
FROM node:18-alpine AS build-frontend

# Set working directory
WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all frontend source files needed for Vite build
COPY . .

# Build the frontend
RUN npm run build


# Stage 2: Prepare production image with backend + built frontend
FROM node:18-alpine AS production

# Set working directory for backend
WORKDIR /app

# Copy backend code
COPY backend ./backend

# Copy built frontend from previous stage
COPY --from=build-frontend /app/dist ./dist

# Copy node_modules if frontend and backend share dependencies
COPY --from=build-frontend /app/node_modules ./node_modules

# Copy any other required project files (e.g., .env if needed at runtime)
# COPY .env .env

# Set the default command (update if using a process manager like PM2)
CMD ["node", "backend/Server.cjs"]
