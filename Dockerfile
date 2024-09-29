# Stage 1: Build the React app
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json/yarn.lock files
COPY package*.json ./
COPY nginx.conf /etc/nginx/nginx.conf

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app for production
RUN npm run build           

# Stage 2: Serve the built app using Nginx
FROM nginx:1.23-alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 to the outside world
EXPOSE 8081

# Copy custom nginx configuration if necessary (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Start Nginx and tell it to use port 8080
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]
