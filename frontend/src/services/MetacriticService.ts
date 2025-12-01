import type { MetacriticData } from '../types';

// Mock scores for specific titles to ensure they look realistic
const MOCK_SCORES: Record<string, number> = {
    "Halo Infinite": 87,
    "Forza Horizon 5": 92,
    "Starfield": 83,
    "Sea of Thieves": 69,
    "Hi-Fi RUSH": 87,
    "Gears 5": 84,
    "Ori and the Will of the Wisps": 90,
    "Hollow Knight": 90,
    "Doom Eternal": 88,
    "Psychonauts 2": 89,
    "Dead Cells": 89,
    "Mass Effect Legendary Edition": 90,
    "Minecraft": 93,
    "Control": 85,
    "Grounded": 82
};

export const MetacriticService = {
    getScore: async (gameTitle: string): Promise<MetacriticData> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

        const score = MOCK_SCORES[gameTitle];

        if (score !== undefined) {
            return {
                score,
                url: `https://www.metacritic.com/game/${gameTitle.toLowerCase().replace(/\s+/g, '-')}`,
                status: 'available'
            };
        }

        // Fallback for unknown games (randomish but consistent based on string length)
        // This is just to handle cases if we add more games to json without adding to MOCK_SCORES
        const pseudoRandomScore = 60 + (gameTitle.length * 3) % 30;

        return {
            score: pseudoRandomScore,
            url: '#',
            status: 'available'
        };
    }
};
