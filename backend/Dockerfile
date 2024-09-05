# Use Node.js 18 as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps


# Copy the rest of the backend code
COPY . .

# Expose port 5000
EXPOSE 5000

# Run the backend server
CMD ["npm", "run", "dev"]
