# frontend/Dockerfile

# Use Node.js LTS
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Start frontend in development
CMD ["npm", "start"]
