export interface Game {
    id: string;
    title: string;
    platform: string[];
    genres: string[];
    description: string;
    coverUrl: string;
    releaseDate?: string;
}

export interface MetacriticData {
    score: number | null;
    url?: string;
    status: 'available' | 'not_found' | 'loading';
}

export interface GameWithScore extends Game {
    metacritic?: MetacriticData;
}

export type SortOption = 'score_desc' | 'az' | 'newest';

export type CardSize = 'small' | 'medium' | 'large';

export interface FilterState {
    search: string;
    genre: string;
    minScore: number;
    sort: SortOption;
    releaseYear: string; // 'all', '2024', '2023', etc.
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
