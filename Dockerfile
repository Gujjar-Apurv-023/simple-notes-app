# Use Node.js base image
FROM node:18

# Create app directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose app port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]