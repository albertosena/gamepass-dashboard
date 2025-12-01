import React from 'react';
import { clsx } from 'clsx';

interface ScoreBadgeProps {
    score: number | null;
    loading?: boolean;
    className?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, loading, className }) => {
    if (loading) {
        return (
            <div className={clsx("w-8 h-8 rounded bg-white/10 animate-pulse", className)} />
        );
    }

    if (score === null) {
        return (
            <div className={clsx(
                "w-8 h-8 rounded flex items-center justify-center font-bold text-xs bg-gray-700 text-gray-400",
                className
            )}>
                -
            </div>
        );
    }

    let bgColor = 'bg-red-600';
    if (score >= 75) bgColor = 'bg-green-600';
    else if (score >= 50) bgColor = 'bg-yellow-600';

    return (
        <div className={clsx(
            "w-8 h-8 rounded flex items-center justify-center font-bold text-sm text-white shadow-sm",
            bgColor,
            className
        )}>
            {score}
        </div>
    );
};
