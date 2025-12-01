# Game Pass API Backend

Backend API em Node.js + TypeScript que busca dados do Xbox Game Pass diretamente dos endpoints da Microsoft.

## 🚀 Recursos

- ✅ Busca dados reais do Game Pass (Console, PC, EA Play)
- ✅ Cache em memória com TTL configurável
- ✅ Endpoints REST bem documentados
- ✅ TypeScript com tipagem forte
- ✅ CORS configurável para integração com frontend
- ✅ Baseado na lógica do [Game-Pass-API](https://github.com/NikkelM/Game-Pass-API)

## 📋 Pré-requisitos

- Node.js v16 ou superior
- npm ou yarn

## ⚙️ Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env conforme necessário (opcional)
```

## 🏃 Como Executar

### Desenvolvimento
```bash
npm run dev
```

O servidor iniciará em `http://localhost:4000` (ou a porta configurada no `.env`).

### Produção
```bash
# Build
npm run build

# Start
npm start
```

## 🛣️ Endpoints

### Health Check
```
GET /health
```
Retorna o status do servidor.

**Resposta:**
```json
{
  "status": "ok"
}
```

---

### Listar todos os jogos
```
GET /api/gamepass/games
```

**Query Parameters:**
- `platform` (opcional): `console`, `pc`, `eaplay`, `all` (padrão: `all`)
- `market` (opcional): código do mercado, ex: `BR`, `US` (padrão: do `.env`)
- `language` (opcional): idioma, ex: `pt-BR`, `en-US` (padrão: do `.env`)

**Exemplo:**
```bash
curl "http://localhost:4000/api/gamepass/games?platform=console&market=BR&language=pt-BR"
```

**Resposta:**
```json
{
  "success": true,
  "count": 150,
  "games": [
    {
      "id": "9NBLGGH4X6FH",
      "title": "Halo Infinite",
      "description": "...",
      "platforms": ["Console", "PC"],
      "genres": ["Shooter", "Action"],
      "coverUrl": "https://...",
      "releaseDate": "2021-12-08T00:00:00Z"
    }
  ]
}
```

---

### Buscar jogo por ID
```
GET /api/gamepass/games/:id
```

**Exemplo:**
```bash
curl "http://localhost:4000/api/gamepass/games/9NBLGGH4X6FH"
```

**Resposta:**
```json
{
  "success": true,
  "game": {
    "id": "9NBLGGH4X6FH",
    "title": "Halo Infinite",
    ...
  }
}
```

---

### Buscar jogos por nome
```
GET /api/gamepass/search?q=<query>
```

**Query Parameters:**
- `q` (obrigatório): termo de busca
- `market` (opcional)
- `language` (opcional)

**Exemplo:**
```bash
curl "http://localhost:4000/api/gamepass/search?q=halo"
```

**Resposta:**
```json
{
  "success": true,
  "query": "halo",
  "count": 3,
  "games": [...]
}
```

---

### Limpar cache
```
POST /api/gamepass/refresh
```

**Headers:**
- `Authorization: Bearer <REFRESH_TOKEN>` (token definido no `.env`)

**Exemplo:**
```bash
curl -X POST "http://localhost:4000/api/gamepass/refresh" \
  -H "Authorization: Bearer dev-secret-token"
```

**Resposta:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

## 🔧 Configuração (.env)

```env
# Porta do servidor
PORT=4000

# Mercado e idioma padrão
DEFAULT_MARKET=BR
DEFAULT_LANGUAGE=pt-BR

# Cache TTL em milissegundos (1 hora = 3600000)
CACHE_TTL_MS=3600000

# Token para endpoint de refresh
REFRESH_TOKEN=your-secret-token

# CORS origin (URL do frontend)
CORS_ORIGIN=http://localhost:5173
```

## 🔄 Integração com Frontend React

No seu componente React:

```typescript
const fetchGames = async () => {
  const response = await fetch(
    'http://localhost:4000/api/gamepass/games?platform=console&market=BR&language=pt-BR'
  );
  const data = await response.json();
  console.log(data.games); // Array de GameCard[]
};
```

## 📦 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts          # Configurações e GUIDs
│   ├── routes/
│   │   └── gamepass.ts        # Rotas da API
│   ├── services/
│   │   └── gamepassService.ts # Lógica de negócio
│   ├── types/
│   │   └── GamePass.ts        # Definições TypeScript
│   └── server.ts              # Bootstrap do servidor
├── .env                       # Variáveis de ambiente
├── .env.example               # Template de .env
├── package.json
└── tsconfig.json
```

## 🧠 Como Funciona

1. **Busca de IDs**: Chama `catalog.gamepass.com/sigls/v2` para obter lista de IDs de produtos
2. **Detalhes**: Busca detalhes em lotes via `displaycatalog.mp.microsoft.com/v7.0/products`
3. **Mapeamento**: Transforma objetos Microsoft em `GameCard` simplificado
4. **Cache**: Armazena em memória com TTL de 1 hora (configurável)

## 🐛 Troubleshooting

### Erro 502 ao buscar jogos
- Verifique sua conexão com a internet
- Endpoints da Microsoft podem estar temporariamente indisponíveis

### Cache não expira
- Verifique o valor de `CACHE_TTL_MS` no `.env`
- Use o endpoint `/refresh` para limpar manualmente

## 📝 Licença

MIT
