import React from 'react';
import type { GameWithScore, CardSize } from '../../types';
import { GameCard } from './GameCard';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GameGridProps {
    games: GameWithScore[];
    loading: boolean;
    cardSize?: CardSize;
}

const getGridClasses = (size: CardSize) => {
    switch (size) {
        case 'small':
            return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4';
        case 'large':
            return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8';
        case 'medium':
        default:
            return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6';
    }
};

export const GameGrid: React.FC<GameGridProps> = ({ games, loading, cardSize = 'medium' }) => {
    const gridClasses = getGridClasses(cardSize);

    if (loading) {
        return (
            <div className={clsx('grid', gridClasses)}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="bg-xbox-light rounded-lg aspect-[2/3] animate-pulse" />
                ))}
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-400">No games found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className={clsx('grid', gridClasses)}>
            {games.map((game) => (
                <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <GameCard game={game} size={cardSize} />
                </motion.div>
            ))}
        </div>
    );
};
