# ==========================
# Stage 1: Build Frontend
# ==========================
FROM node:18-alpine AS build-frontend

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm install

# Support Vite config in TypeScript
RUN npm install -D ts-node typescript

# Copy all code
COPY . .

# Build with VITE_API_URL passed at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


# ==========================
# Stage 2: Backend & Serve Static Files
# ==========================
FROM node:18-alpine

WORKDIR /app

# Copy backend server and built frontend
COPY backend ./backend
COPY --from=build-frontend /app/dist ./dist
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "backend/Server.js"]
