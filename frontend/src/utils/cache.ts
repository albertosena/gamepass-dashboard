/**
 * localStorage Cache Utility
 * Prevents excessive API calls by caching data with TTL
 */

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

const CACHE_PREFIX = 'gamepass_';
const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

export class CacheService {
    /**
     * Save data to cache
     */
    static set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
        try {
            const entry: CacheEntry<T> = {
                data,
                timestamp: Date.now(),
                expiresAt: Date.now() + ttl,
            };

            localStorage.setItem(
                `${CACHE_PREFIX}${key}`,
                JSON.stringify(entry)
            );
        } catch (error) {
            console.warn('[CacheService] Failed to save to cache:', error);
        }
    }

    /**
     * Get data from cache (if not expired)
     */
    static get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);

            if (!item) {
                return null;
            }

            const entry: CacheEntry<T> = JSON.parse(item);

            // Check if expired
            if (Date.now() > entry.expiresAt) {
                this.remove(key);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.warn('[CacheService] Failed to read from cache:', error);
            return null;
        }
    }

    /**
     * Remove a specific key from cache
     */
    static remove(key: string): void {
        try {
            localStorage.removeItem(`${CACHE_PREFIX}${key}`);
        } catch (error) {
            console.warn('[CacheService] Failed to remove from cache:', error);
        }
    }

    /**
     * Clear all cache entries
     */
    static clearAll(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if (key.startsWith(CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('[CacheService] Failed to clear cache:', error);
        }
    }

    /**
     * Get cache age in minutes
     */
    static getCacheAge(key: string): number | null {
        try {
            const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);

            if (!item) {
                return null;
            }

            const entry: CacheEntry<any> = JSON.parse(item);
            const ageMs = Date.now() - entry.timestamp;
            return Math.floor(ageMs / 60000);
        } catch (error) {
            return null;
        }
    }
}
