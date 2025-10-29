# Use a base image with Puppeteer support
FROM node:20

# Installs necessary dependencies for Chromium/Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libxss1 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Defines the working directory
WORKDIR /app

# Copies dependency files
COPY package*.json ./

# Installs all dependencies
RUN npm ci

# Copies the rest of the project
COPY . .

# Performs the build (if necessary)
RUN npm run build

# Removes devDependencies
RUN npm prune --production

# Exposes the port
EXPOSE 3000

# Starts the application
CMD ["node", "dist/main.js"]