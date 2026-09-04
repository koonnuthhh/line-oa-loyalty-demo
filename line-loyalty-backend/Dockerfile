# Use official Node.js Alpine image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only the package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .


# Build the NestJS application (TypeScript → JavaScript)
RUN npm run build

# Copy credentials for Google Sheets
COPY ./src/GoogleSheet/google-sheets-key.json ./dist/src/GoogleSheet/google-sheets-key.json

COPY ./views ./dist/views

# Expose the app's port
EXPOSE 9876

# Start the app (entry file is in dist/src/main.js)
CMD ["node", "dist/src/main"]
