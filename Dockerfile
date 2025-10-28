# Use uma imagem base com suporte ao Puppeteer
FROM node:20

# Instala dependências necessárias para o Chromium/Puppeteer
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

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala todas as dependências
RUN npm ci

# Copia o resto do projeto
COPY . .

# Faz o build (se necessário)
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# Expõe a porta
EXPOSE 3000

# Inicia a aplicação
CMD ["node", "dist/main.js"]