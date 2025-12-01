import type { Game } from '../types';
import { CacheService } from '../utils/cache';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export const GameService = {
    /**
     * Fetch games from the backend API with cache
     * Falls back to mock data if API is not available
     */
    getGames: async (platform: string = 'console'): Promise<Game[]> => {
        const cacheKey = `games_${platform}`;

        // Try to get from cache first
        const cachedData = CacheService.get<Game[]>(cacheKey);
        if (cachedData) {
            const age = CacheService.getCacheAge(cacheKey);
            console.log(`[GameService] Using cached data (age: ${age} minutes)`);
            return cachedData;
        }

        try {
            console.log('[GameService] Fetching from API...');
            const response = await fetch(
                `${API_BASE_URL}/api/gamepass/games?platform=${platform}&market=BR&language=pt-BR`
            );

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();

            const games: Game[] = data.games.map((game: any) => ({
                id: game.id,
                title: game.title,
                platform: game.platforms || ['Console'],
                genres: game.genres || [],
                description: game.description || '',
                coverUrl: game.coverUrl || 'https://upload.wikimedia.org/wikipedia/pt/d/dc/Capa_de_Forza_Horizon_5.jpg',
                releaseDate: game.releaseDate,
            }));

            // Save to cache
            CacheService.set(cacheKey, games, CACHE_TTL);
            console.log(`[GameService] Cached ${games.length} games`);

            return games;
        } catch (error) {
            console.error('[GameService] Error fetching from API, using mock data:', error);

            // Fallback to mock data
            const gamesData = await import('../data/games.json');
            const games = gamesData.default as Game[];

            // Cache mock data too (shorter TTL)
            CacheService.set(cacheKey, games, 5 * 60 * 1000);

            return games;
        }
    },

    /**
     * Search games by name
     */
    searchGames: async (query: string): Promise<Game[]> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/gamepass/search?q=${encodeURIComponent(query)}&market=BR&language=pt-BR`
            );

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();

            return data.games.map((game: any) => ({
                id: game.id,
                title: game.title,
                platform: game.platforms || ['Console'],
                genres: game.genres || [],
                description: game.description || '',
                coverUrl: game.coverUrl || 'https://upload.wikimedia.org/wikipedia/pt/d/dc/Capa_de_Forza_Horizon_5.jpg',
                releaseDate: game.releaseDate,
            }));
        } catch (error) {
            console.error('[GameService] Search error:', error);
            return [];
        }
    },

    /**
     * Clear cache manually
     */
    clearCache: () => {
        CacheService.clearAll();
        console.log('[GameService] Cache cleared');
    }
};
