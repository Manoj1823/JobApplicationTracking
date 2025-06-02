# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (frontend + backend)
RUN npm install

# Copy the entire project
COPY . .

# Expose the backend port (change if your server uses a different port)
EXPOSE 5000

# Start both frontend and backend concurrently
CMD ["npm", "run", "dev"]
