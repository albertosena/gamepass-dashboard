import { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout/Layout';
import { FiltersBar } from './components/UI/FiltersBar';
import { GameGrid } from './components/Game/GameGrid';
import { Pagination } from './components/UI/Pagination';
import { GameService } from './services/GameService';
import { MetacriticService } from './services/MetacriticService';
import type { GameWithScore, FilterState, CardSize, PaginationState } from './types';

const ITEMS_PER_PAGE = 24;

function App() {
  const [games, setGames] = useState<GameWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardSize, setCardSize] = useState<CardSize>('small');
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    genre: '',
    minScore: 0,
    sort: 'score_desc',
    releaseYear: 'all',
  });

  // Fetch initial catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const catalog = await GameService.getGames();

        // Initialize games with loading status for scores
        const gamesWithLoadingScores: GameWithScore[] = catalog.map(game => ({
          ...game,
          metacritic: { score: null, status: 'loading' }
        }));

        setGames(gamesWithLoadingScores);
        setLoading(false);

        // Fetch scores in the background
        catalog.forEach(async (game) => {
          try {
            const metaData = await MetacriticService.getScore(game.title);
            setGames(prev => prev.map(g =>
              g.id === game.id ? { ...g, metacritic: metaData } : g
            ));
          } catch (err) {
            console.error(`Failed to fetch score for ${game.title}`, err);
            setGames(prev => prev.map(g =>
              g.id === game.id ? { ...g, metacritic: { score: null, status: 'not_found' } } : g
            ));
          }
        });

      } catch (err) {
        setError('Failed to load Game Pass catalog.');
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Extract unique genres
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    games.forEach(game => {
      game.genres.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [games]);

  // Extract unique years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    games.forEach(game => {
      if (game.releaseDate) {
        const year = new Date(game.releaseDate).getFullYear().toString();
        if (!isNaN(Number(year))) {
          years.add(year);
        }
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [games]);

  // Filter and Sort
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(g => g.title.toLowerCase().includes(q));
    }

    // Genre
    if (filters.genre) {
      result = result.filter(g => g.genres.includes(filters.genre));
    }

    // Release Year
    if (filters.releaseYear && filters.releaseYear !== 'all') {
      result = result.filter(g => {
        if (!g.releaseDate) return false;
        const year = new Date(g.releaseDate).getFullYear().toString();
        return year === filters.releaseYear;
      });
    }

    // Score
    if (filters.minScore > 0) {
      result = result.filter(g => (g.metacritic?.score || 0) >= filters.minScore);
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sort === 'az') {
        return a.title.localeCompare(b.title);
      } else if (filters.sort === 'newest') {
        return (b.releaseDate || '').localeCompare(a.releaseDate || '');
      } else {
        // Score Descending (default)
        const scoreA = a.metacritic?.score ?? -1;
        const scoreB = b.metacritic?.score ?? -1;
        return scoreB - scoreA;
      }
    });

    return result;
  }, [games, filters]);

  // Pagination
  const pagination: PaginationState = useMemo(() => {
    const totalItems = filteredGames.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return {
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      totalItems,
      totalPages,
    };
  }, [filteredGames, currentPage]);

  // Paginated games
  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredGames.slice(startIndex, endIndex);
  }, [filteredGames, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-xbox-green text-white rounded hover:bg-green-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Console Games</h2>
        <p className="text-gray-400">
          Explore the library of {filteredGames.length} games available on Xbox Game Pass Console.
        </p>
      </div>

      <FiltersBar
        filters={filters}
        onFilterChange={setFilters}
        availableGenres={availableGenres}
        availableYears={availableYears}
        cardSize={cardSize}
        onCardSizeChange={setCardSize}
      />

      <GameGrid games={paginatedGames} loading={loading} cardSize={cardSize} />

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </Layout>
  );
}

export default App;
