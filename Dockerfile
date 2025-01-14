# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY build/ /app/build

RUN "sudo npm install pm2"

EXPOSE 3000

# Start Nginx server
CMD ["pm2", "start", "server.js;"]