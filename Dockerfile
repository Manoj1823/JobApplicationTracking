# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy all files (frontend + backend + package.json etc)
COPY . .

# Install backend dependencies
RUN npm install

# Change directory to frontend (src) and install dependencies + build
WORKDIR /app/src
RUN npm install
RUN npm run build

# Back to root (backend runs from backend folder)
WORKDIR /app/backend

# Expose port (same as your backend PORT)
EXPOSE 5000

# Run backend server (it will serve frontend from /app/dist)
CMD ["node", "Server.cjs"]
