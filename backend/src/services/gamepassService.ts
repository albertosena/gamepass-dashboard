import axios from 'axios';
import { config } from '../config';
import type {
    GameCard,
    MicrosoftProduct,
    SiglsResponse,
    GamePassQueryOptions,
    CacheStore,
} from '../types/GamePass';

// In-memory cache
const cache: CacheStore = {};

/**
 * Game Pass Service
 * Handles fetching game data from Microsoft's endpoints and caching
 */
export class GamePassService {
    /**
     * Get cache key based on options
     */
    private static getCacheKey(options: GamePassQueryOptions): string {
        const platform = options.platform || 'all';
        const market = options.market || config.gamePass.market;
        const language = options.language || config.gamePass.language;
        return `${platform}-${market}-${language}`;
    }

    /**
     * Check if cache entry is valid
     */
    private static isCacheValid(cacheKey: string): boolean {
        const entry = cache[cacheKey];
        if (!entry) return false;

        const now = Date.now();
        const age = now - entry.timestamp;
        return age < config.cache.ttlMs;
    }

    /**
     * Step 1: Fetch Game Pass product IDs from catalog endpoint
     */
    private static async getGamePassIds(
        options: GamePassQueryOptions
    ): Promise<string[]> {
        const platform = options.platform || 'all';
        const market = options.market || config.gamePass.market;
        const language = options.language || config.gamePass.language;

        // Get the appropriate catalog ID
        const catalogId = config.gamePass.catalogIds[platform] || config.gamePass.catalogIds.all;

        const url = `https://catalog.gamepass.com/sigls/v2`;

        try {
            console.log(`[GamePassService] Fetching catalog IDs for platform: ${platform}`);

            const response = await axios.get<SiglsResponse[]>(url, {
                params: {
                    id: catalogId,
                    language,
                    market,
                },
                headers: {
                    'Accept': 'application/json',
                },
            });

            // Extract product IDs from the response
            const ids = response.data.map((item) => item.id);
            console.log(`[GamePassService] Found ${ids.length} product IDs`);

            return ids;
        } catch (error: any) {
            console.error('[GamePassService] Error fetching catalog IDs:', error.message);
            throw new Error('Failed to fetch Game Pass catalog IDs');
        }
    }

    /**
     * Step 2: Fetch product details from display catalog
     * Batches requests to avoid overwhelming the API
     */
    private static async getProductsDetails(
        ids: string[],
        options: GamePassQueryOptions
    ): Promise<MicrosoftProduct[]> {
        const market = options.market || config.gamePass.market;
        const language = options.language || config.gamePass.language;

        // Batch size (Microsoft supports multiple IDs in one request)
        const BATCH_SIZE = 20;
        const batches: string[][] = [];

        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            batches.push(ids.slice(i, i + BATCH_SIZE));
        }

        console.log(`[GamePassService] Fetching details in ${batches.length} batches`);

        const allProducts: MicrosoftProduct[] = [];

        for (const batch of batches) {
            const bigIds = batch.join(',');
            const url = `https://displaycatalog.mp.microsoft.com/v7.0/products`;

            try {
                const response = await axios.get<{ Products: MicrosoftProduct[] }>(url, {
                    params: {
                        bigIds,
                        market,
                        languages: language,
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (response.data.Products) {
                    allProducts.push(...response.data.Products);
                }
            } catch (error: any) {
                console.error('[GamePassService] Error fetching product details:', error.message);
                // Continue with other batches even if one fails
            }
        }

        console.log(`[GamePassService] Fetched details for ${allProducts.length} products`);
        return allProducts;
    }

    /**
     * Step 3: Map Microsoft product to simplified GameCard
     */
    private static mapProductToGameCard(product: MicrosoftProduct): GameCard {
        const localized = product.LocalizedProperties?.[0];
        const market = product.MarketProperties?.[0];
        const properties = product.Properties;

        // Extract title and description
        const title = localized?.ProductTitle || 'Unknown Game';
        const description = localized?.ShortDescription || localized?.ProductDescription || '';

        // Extract cover image (prefer Poster, then BoxArt, then any image)
        let coverUrl: string | null = null;
        if (localized?.Images) {
            const poster = localized.Images.find((img) => img.ImagePurpose === 'Poster');
            const boxArt = localized.Images.find((img) => img.ImagePurpose === 'BoxArt');
            const anyImage = localized.Images[0];

            coverUrl = poster?.Uri || boxArt?.Uri || anyImage?.Uri || null;
        }

        // Extract platforms from attributes
        const platforms: string[] = [];
        if (properties?.Attributes) {
            properties.Attributes.forEach((attr) => {
                if (attr.Name === 'PlatformDependencyXboxOne') platforms.push('Console');
                if (attr.Name === 'PlatformDependencyXboxSeriesX') platforms.push('Console');
                if (attr.Name === 'PlatformDependencyWindows') platforms.push('PC');
                if (attr.Name === 'XboxLiveGoldRequired' && attr.Minimum === 0) platforms.push('Cloud');
            });
        }

        // Deduplicate platforms
        const uniquePlatforms = Array.from(new Set(platforms));

        // Extract genres from categories
        const genres = properties?.Categories || [];

        // Extract release date
        const releaseDate = market?.ReleaseDate || market?.OriginalReleaseDate || properties?.ReleaseDate || null;

        return {
            id: product.ProductId,
            title,
            description,
            platforms: uniquePlatforms,
            genres,
            coverUrl,
            releaseDate,
        };
    }

    /**
     * Main method: Get all Game Pass games
     */
    public static async getAllGames(options: GamePassQueryOptions = {}): Promise<GameCard[]> {
        const cacheKey = this.getCacheKey(options);

        // Check cache first
        if (this.isCacheValid(cacheKey)) {
            console.log(`[GamePassService] Returning cached data for key: ${cacheKey}`);
            return cache[cacheKey].games;
        }

        console.log(`[GamePassService] Cache miss or expired for key: ${cacheKey}`);

        // Fetch fresh data
        const ids = await this.getGamePassIds(options);
        const products = await this.getProductsDetails(ids, options);
        const games = products.map((p) => this.mapProductToGameCard(p));

        // Update cache
        cache[cacheKey] = {
            timestamp: Date.now(),
            games,
        };

        return games;
    }

    /**
     * Get a single game by ID
     */
    public static async getGameById(
        id: string,
        options: GamePassQueryOptions = {}
    ): Promise<GameCard | null> {
        const games = await this.getAllGames(options);
        return games.find((g) => g.id === id) || null;
    }

    /**
     * Search games by title
     */
    public static async searchGames(
        query: string,
        options: GamePassQueryOptions = {}
    ): Promise<GameCard[]> {
        const games = await this.getAllGames(options);
        const q = query.toLowerCase();
        return games.filter((g) => g.title.toLowerCase().includes(q));
    }

    /**
     * Clear cache manually
     */
    public static clearCache(): void {
        Object.keys(cache).forEach((key) => delete cache[key]);
        console.log('[GamePassService] Cache cleared');
    }
}
