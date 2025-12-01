import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    gamePass: {
        market: process.env.DEFAULT_MARKET || 'BR',
        language: process.env.DEFAULT_LANGUAGE || 'pt-BR',

        // GUIDs for different Game Pass catalogs
        // These are the official Microsoft IDs for different Game Pass lists
        catalogIds: {
            console: 'f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e', // Console Game Pass
            pc: 'fdd9e2a7-0fee-49f6-ad69-4354098401ff',      // PC Game Pass
            eaPlay: 'b8900d09-a491-44cc-916e-32b5acae621a',  // EA Play
            all: 'f13cf6b4-57e6-4459-89df-6aec18cf0538'      // All Game Pass
        },
    },

    cache: {
        ttlMs: parseInt(process.env.CACHE_TTL_MS || '3600000', 10), // 1 hour default
    },

    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },

    refreshToken: process.env.REFRESH_TOKEN || '',
};
