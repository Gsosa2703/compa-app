# Use Node.js 18 as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the frontend server
CMD ["npm", "run", "dev"]
