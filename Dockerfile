# project/Dockerfile
FROM node:18

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY . .

CMD ["node", "backend/Server.cjs"]
