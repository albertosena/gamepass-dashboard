import { Router, Request, Response } from 'express';
import { GamePassService } from '../services/gamepassService';
import { config } from '../config';
import type { GamePassQueryOptions } from '../types/GamePass';

const router = Router();

/**
 * GET /api/gamepass/games
 * Returns all Game Pass games for the specified platform
 */
router.get('/games', async (req: Request, res: Response) => {
    try {
        const { platform, market, language } = req.query;

        // Validate platform parameter
        const validPlatforms = ['console', 'pc', 'cloud', 'eaplay', 'all'];
        if (platform && !validPlatforms.includes(platform as string)) {
            return res.status(400).json({
                error: 'INVALID_PLATFORM',
                message: `Platform must be one of: ${validPlatforms.join(', ')}`,
            });
        }

        const options: GamePassQueryOptions = {
            platform: (platform as any) || 'all',
            market: (market as string) || undefined,
            language: (language as string) || undefined,
        };

        const games = await GamePassService.getAllGames(options);

        res.json({
            success: true,
            count: games.length,
            games,
        });
    } catch (error: any) {
        console.error('[Route /games] Error:', error);
        res.status(502).json({
            error: 'UPSTREAM_ERROR',
            message: 'Failed to fetch Game Pass catalog from Microsoft',
            details: error.message,
        });
    }
});

/**
 * GET /api/gamepass/games/:id
 * Returns a single game by its product ID
 */
router.get('/games/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { market, language } = req.query;

        const options: GamePassQueryOptions = {
            market: (market as string) || undefined,
            language: (language as string) || undefined,
        };

        const game = await GamePassService.getGameById(id, options);

        if (!game) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: `Game with ID ${id} not found`,
            });
        }

        res.json({
            success: true,
            game,
        });
    } catch (error: any) {
        console.error(`[Route /games/${req.params.id}] Error:`, error);
        res.status(502).json({
            error: 'UPSTREAM_ERROR',
            message: 'Failed to fetch game details',
            details: error.message,
        });
    }
});

/**
 * GET /api/gamepass/search
 * Search games by title
 */
router.get('/search', async (req: Request, res: Response) => {
    try {
        const { q, market, language } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                error: 'MISSING_QUERY',
                message: 'Query parameter "q" is required',
            });
        }

        const options: GamePassQueryOptions = {
            market: (market as string) || undefined,
            language: (language as string) || undefined,
        };

        const games = await GamePassService.searchGames(q, options);

        res.json({
            success: true,
            query: q,
            count: games.length,
            games,
        });
    } catch (error: any) {
        console.error('[Route /search] Error:', error);
        res.status(502).json({
            error: 'UPSTREAM_ERROR',
            message: 'Failed to search games',
            details: error.message,
        });
    }
});

/**
 * POST /api/gamepass/refresh
 * Manually clear cache and force refresh
 * Requires REFRESH_TOKEN in Authorization header
 */
router.post('/refresh', (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!config.refreshToken || token !== config.refreshToken) {
        return res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Invalid or missing refresh token',
        });
    }

    GamePassService.clearCache();

    res.json({
        success: true,
        message: 'Cache cleared successfully',
    });
});

export default router;
