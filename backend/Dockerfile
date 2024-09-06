# Use Node.js 18 as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

# Copy the tsconfig.json and ormconfig.json files into the container
COPY tsconfig.json ormconfig.json ./

# Copy the rest of the backend code
COPY ./src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Set environment variables if needed
ENV DATABASE_HOST=postgres
ENV DATABASE_PORT=5432
ENV DATABASE_USER=clercminator
ENV DATABASE_PASSWORD=123
ENV DATABASE_NAME=compa-app

# Run the compiled backend server (JavaScript files)
CMD ["npm", "start"]
