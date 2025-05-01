# Use a lightweight Node.js image
FROM node:22-alpine 

WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY package.json package-lock.json ./

RUN yarn install --frozen-lockfile

# Copy the rest of your source code
COPY . .




EXPOSE 3000

# Start the app in development mode
CMD ["yarn", "dev"]