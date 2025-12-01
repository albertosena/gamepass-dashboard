import express from 'express';
import cors from 'cors';
import { config } from './config';
import gamepassRoutes from './routes/gamepass';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// API routes
app.use('/api/gamepass', gamepassRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Endpoint not found',
    });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Server Error]', err);
    res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: config.nodeEnv === 'development' ? err.message : undefined,
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║         Game Pass API Backend                        ║
║                                                       ║
║  Server running on: http://localhost:${config.port}       ║
║  Environment: ${config.nodeEnv.padEnd(30)}      ║
║  Market: ${config.gamePass.market.padEnd(36)}      ║
║  Language: ${config.gamePass.language.padEnd(33)}      ║
║                                                       ║
║  Endpoints:                                           ║
║  - GET  /health                                       ║
║  - GET  /api/gamepass/games                           ║
║  - GET  /api/gamepass/games/:id                       ║
║  - GET  /api/gamepass/search                          ║
║  - POST /api/gamepass/refresh                         ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
