# Use a Node.js runtime as the base image
FROM node:20.0.0-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the application
FROM nginx:alpine

# Copy the build output to the web server's document root
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start the web server
CMD ["nginx", "-g", "daemon off;"]
