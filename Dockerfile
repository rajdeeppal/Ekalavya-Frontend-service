# Step 1: Build the React app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the React app
FROM node:16

# Install serve
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy build artifacts from the previous stage
COPY --from=build /app/build ./build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build"]
