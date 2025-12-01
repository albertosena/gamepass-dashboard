# Xbox Game Pass Dashboard - Full Stack

Aplicação completa (Frontend + Backend) para visualizar o catálogo do Xbox Game Pass com dados reais da Microsoft e enriquecimento com scores do Metacritic.

## 📁 Estrutura do Projeto

```
gamepassdash/
├── frontend/          # Frontend React (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   └── package.json
│
└── backend/           # Backend API (Node.js + TypeScript + Express)
    ├── src/
    │   ├── config/
    │   ├── routes/
    │   ├── services/
    │   ├── types/
    │   └── server.ts
    └── package.json
```

## 🚀 Como Executar

### 1. Backend (API)

```bash
cd backend
npm install
npm run dev
```

O backend será iniciado em `http://localhost:4000`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

O frontend será iniciado em `http://localhost:5173`

## 🐳 Rodando com Docker

### 1. Pré-requisitos

- [Docker](https://www.docker.com/) instalado na sua máquina

### 2. Configuração

1. **Renomeie os arquivos de exemplo:**

```bash
mv docker-compose.example.yml docker-compose.yml
```

### 2. Suba os containers

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

- O **backend** ficará disponível em `http://localhost:4000`
- O **frontend** ficará disponível em `http://localhost:5173`

### 3. Parar os containers

```bash
docker compose down
```

## ✨ Recursos Implementados

### Frontend
- ✅ Interface moderna inspirada no Xbox (dark mode)
- ✅ **Grid responsivo com 3 tamanhos de card** (small, medium, large)
- ✅ **Cache localStorage** (30min TTL) - evita chamadas desnecessárias à API
- ✅ **Paginação** (24 jogos por página)
- ✅ **Filtros avançados:**
  - Busca por nome
  - Filtro por gênero
  - Filtro por ano de lançamento
  - Filtro por score Metacritic
- ✅ **Ordenação** (Score, A-Z, Mais recente)
- ✅ Integração com Metacritic
- ✅ Animações suaves com Framer Motion
- ✅ Loading states e error handling

### Backend
- ✅ Dados reais do Xbox Game Pass via endpoints Microsoft
- ✅ Cache em memória (TTL configurável)
- ✅ Suporte a múltiplas plataformas (Console, PC, EA Play)
- ✅ API REST completa
- ✅ TypeScript com tipagem forte
- ✅ Batching de requisições (20 produtos por lote)
- ✅ CORS configurável

## 🔑 Principais Melhorias

### 1. Cache LocalStorage
```typescript
// Evita chamadas repetidas à API
const cachedData = CacheService.get('games_console');
if (cachedData) {
  return cachedData; // Retorna do cache
}
// Caso contrário, busca da API
```

### 2. Paginação
- **24 jogos por página** (configurável)
- Navegação inteligente (mostra sempre primeira, última e páginas próximas)
- Reset automático ao mudar filtros
- Scroll suave ao trocar de página

### 3. Filtro de Ano
- Extrai anos únicos dos jogos automaticamente
- Dropdown com anos ordenados (mais recente primeiro)
- Funciona em conjunto com outros filtros

## 🛠️ Tech Stack

### Frontend
- React + TypeScript (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- Lucide Icons

### Backend
- Node.js + TypeScript
- Express
- Axios
- CORS

## 📝 Configuração

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:4000
```

### Backend (backend/.env)
```env
PORT=4000
DEFAULT_MARKET=BR
DEFAULT_LANGUAGE=pt-BR
CACHE_TTL_MS=3600000
CORS_ORIGIN=http://localhost:5173
```

## 📊 API Endpoints

- **GET** `/health` - Health check
- **GET** `/api/gamepass/games` - Lista todos os jogos
- **GET** `/api/gamepass/games/:id` - Detalhes de um jogo
- **GET** `/api/gamepass/search?q=<term>` - Buscar jogos
- **POST** `/api/gamepass/refresh` - Limpa cache (requer token)

Ver [backend/README.md](backend/README.md) para documentação completa.

## 🔄 Fluxo de Dados

1. **Frontend** verifica cache localStorage
2. Se cache expirado, faz requisição ao **Backend**
3. **Backend** verifica seu cache em memória
4. Se não tem cache, busca de **Microsoft APIs**
5. Dados retornam para o frontend
6. Frontend armazena em cache e exibe

## 🎯 Performance

- **Cache duplo**: localStorage (cliente) + memória (servidor)
- **Paginação**: Renderiza apenas 24 jogos por vez
- **Lazy loading**: Imagens carregam sob demanda
- **Batching**: Requisições em lotes de 20 jogos

## 📄 Licença

MIT
