import React from 'react';
import { motion } from 'framer-motion';
import type { GameWithScore, CardSize } from '../../types';
import { ScoreBadge } from './ScoreBadge';
import { Monitor, Gamepad2, Cloud } from 'lucide-react';
import { clsx } from 'clsx';

interface GameCardProps {
    game: GameWithScore;
    size?: CardSize;
}

export const GameCard: React.FC<GameCardProps> = ({ game, size = 'medium' }) => {
    const { title, coverUrl, platform, description, metacritic } = game;

    // Adjust text sizes based on card size
    const titleSize = {
        small: 'text-sm',
        medium: 'text-lg',
        large: 'text-xl'
    }[size];

    const iconSize = {
        small: 14,
        medium: 16,
        large: 18
    }[size];

    const padding = {
        small: 'p-2',
        medium: 'p-4',
        large: 'p-5'
    }[size];

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-xbox-light rounded-lg overflow-hidden shadow-lg group flex flex-col h-full border border-transparent hover:border-xbox-green/50 transition-colors"
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className={clsx('absolute top-2 right-2', size === 'small' && 'top-1 right-1')}>
                    <ScoreBadge
                        score={metacritic?.score ?? null}
                        loading={metacritic?.status === 'loading'}
                    />
                </div>
                <div className={clsx(
                    'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300',
                    padding
                )}>
                    <p className={clsx('text-gray-300 line-clamp-3', size === 'small' ? 'text-[10px]' : 'text-xs')}>
                        {description}
                    </p>
                </div>
            </div>

            <div className={clsx(padding, 'flex flex-col flex-grow')}>
                <h3 className={clsx('font-bold leading-tight mb-2 text-white group-hover:text-xbox-green transition-colors', titleSize)}>
                    {title}
                </h3>

                <div className={clsx('mt-auto pt-3 flex items-center justify-between border-t border-white/10', size === 'small' && 'pt-2')}>
                    <div className="flex gap-2 text-gray-400">
                        {platform.includes('Console') && <Gamepad2 size={iconSize} />}
                        {platform.includes('PC') && <Monitor size={iconSize} />}
                        {platform.includes('Cloud') && <Cloud size={iconSize} />}
                    </div>
                    <span className={clsx(
                        'font-bold uppercase tracking-wider bg-white/10 rounded text-gray-300',
                        size === 'small' ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'
                    )}>
                        Game Pass
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
