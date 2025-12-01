FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Copia apenas os arquivos necessários para produção
COPY tsconfig.json ./
COPY .env.example ./
COPY src ./src

EXPOSE 4000

# Garante que o servidor rode ouvindo em 0.0.0.0 para acesso externo
CMD ["npm", "run", "dev"]