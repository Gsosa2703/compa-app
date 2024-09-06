# Use Node.js 18 as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first for better layer caching
COPY package.json package-lock.json ./

# Install the dependencies (using --legacy-peer-deps to handle peer dependency conflicts)
RUN npm install --legacy-peer-deps

# Copy the rest of the backend source code and configuration files
COPY tsconfig.json ./
COPY ormconfig.json ./
COPY ./src ./src

# Compile TypeScript to JavaScript (only if the build command is defined in your package.json)
RUN npm run build

# Expose port 5000 for the backend
EXPOSE 5000

# Set environment variables through the Docker environment (use .env file for dynamic vars)
# It's better to rely on a .env file for variables rather than hardcoding here.
# For example, Docker Compose will handle passing the .env variables.
ENV NODE_ENV=production

# Start the application using the built JavaScript files in the dist folder
CMD ["npm", "start"]
