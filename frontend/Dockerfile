FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Garante que o Vite rode ouvindo em 0.0.0.0 para acesso externo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]