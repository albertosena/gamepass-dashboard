import React from 'react';
import type { FilterState, SortOption, CardSize } from '../../types';
import { Search, Filter, ArrowUpDown, LayoutGrid, Calendar } from 'lucide-react';

interface FiltersBarProps {
    filters: FilterState;
    onFilterChange: (newFilters: FilterState) => void;
    availableGenres: string[];
    availableYears: string[];
    cardSize: CardSize;
    onCardSizeChange: (size: CardSize) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
    filters,
    onFilterChange,
    availableGenres,
    availableYears,
    cardSize,
    onCardSizeChange
}) => {

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, genre: e.target.value });
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, minScore: Number(e.target.value) });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, sort: e.target.value as SortOption });
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, releaseYear: e.target.value });
    };

    return (
        <div className="bg-xbox-light p-4 rounded-lg shadow-md mb-6 flex flex-col gap-4 sticky top-20 z-40 border border-white/5">
            {/* Search Bar */}
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-xbox-dark text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm transition-colors"
                    placeholder="Search games..."
                    value={filters.search}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 w-full items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Genre Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-xbox-dark text-gray-300 text-sm rounded-md border-transparent focus:ring-xbox-green focus:border-xbox-green block p-2"
                            value={filters.genre}
                            onChange={handleGenreChange}
                        >
                            <option value="">All Genres</option>
                            {availableGenres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-xbox-dark text-gray-300 text-sm rounded-md border-transparent focus:ring-xbox-green focus:border-xbox-green block p-2"
                            value={filters.releaseYear}
                            onChange={handleYearChange}
                        >
                            <option value="all">All Years</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Score Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Score:</span>
                        <select
                            className="bg-xbox-dark text-gray-300 text-sm rounded-md border-transparent focus:ring-xbox-green focus:border-xbox-green block p-2"
                            value={filters.minScore}
                            onChange={handleScoreChange}
                        >
                            <option value={0}>Any</option>
                            <option value={90}>90+</option>
                            <option value={80}>80+</option>
                            <option value={75}>75+</option>
                            <option value={50}>50+</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-xbox-dark text-gray-300 text-sm rounded-md border-transparent focus:ring-xbox-green focus:border-xbox-green block p-2"
                            value={filters.sort}
                            onChange={handleSortChange}
                        >
                            <option value="score_desc">Highest Score</option>
                            <option value="az">A-Z</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>
                </div>

                {/* Card Size Selector */}
                <div className="flex items-center gap-1 bg-xbox-dark rounded-md p-1">
                    <button
                        onClick={() => onCardSizeChange('small')}
                        className={`p-1.5 rounded transition-colors ${cardSize === 'small'
                                ? 'bg-xbox-green text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        title="Small cards"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        onClick={() => onCardSizeChange('medium')}
                        className={`p-1.5 rounded transition-colors ${cardSize === 'medium'
                                ? 'bg-xbox-green text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        title="Medium cards"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => onCardSizeChange('large')}
                        className={`p-1.5 rounded transition-colors ${cardSize === 'large'
                                ? 'bg-xbox-green text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                        title="Large cards"
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
