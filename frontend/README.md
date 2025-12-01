# Xbox Game Pass Console Catalog + Metacritic

Aplicação completa (Frontend + Backend) para visualizar o catálogo do Xbox Game Pass com integração de dados reais da Microsoft e enriquecimento com scores do Metacritic.

## 📁 Estrutura do Projeto

```
gamepassdash/
├── backend/           # Backend API (Node.js + TypeScript)
└── src/              # Frontend React (Vite + TypeScript)
```

## 🚀 Como Executar

### 1. Backend (API)

```bash
cd backend
npm install
npm run dev
```

O backend será iniciado em `http://localhost:4000`

**Endpoints disponíveis:**
- `GET /health` - Status do servidor
- `GET /api/gamepass/games` - Lista todos os jogos
- `GET /api/gamepass/games/:id` - Detalhes de um jogo
- `GET /api/gamepass/search?q=<termo>` - Buscar jogos

Ver [backend/README.md](backend/README.md) para documentação completa da API.

### 2. Frontend (React)

```bash
npm install
npm run dev
```

O frontend será iniciado em `http://localhost:5173`

## ✨ Recursos

### Frontend
- ✅ Interface moderna inspirada no Xbox
- ✅ Grid responsivo com 3 tamanhos de card (small, medium, large)
- ✅ Filtros por gênero e score
- ✅ Busca por nome
- ✅ Ordenação (Score, A-Z, Mais recente)
- ✅ Integração com Metacritic
- ✅ Animações suaves com Framer Motion
- ✅ Dark mode

### Backend
- ✅ Dados reais do Xbox Game Pass
- ✅ Cache em memória (TTL configurável)
- ✅ Suporte a múltiplas plataformas (Console, PC, EA Play)
- ✅ API REST completa
- ✅ TypeScript com tipagem forte

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

### Frontend (.env)
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

## 🔄 Fluxo de Dados

1. Frontend faz requisição para o backend
2. Backend busca dados dos endpoints da Microsoft:
   - `catalog.gamepass.com` - Lista de IDs
   - `displaycatalog.mp.microsoft.com` - Detalhes dos jogos
3. Backend mapeia dados para formato simplificado
4. Frontend exibe os jogos com enriquecimento Metacritic

## 📸 Screenshots

(Adicione screenshots aqui)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

MIT
