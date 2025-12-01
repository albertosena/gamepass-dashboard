// Frontend-friendly interface for game cards
export interface GameCard {
    id: string;
    title: string;
    description: string;
    platforms: string[];
    genres: string[];
    coverUrl: string | null;
    releaseDate: string | null;
    isEAPlay?: boolean;
}

// Microsoft API response types (simplified)
export interface SiglsResponse {
    id: string;
    title?: string;
}

export interface MicrosoftProduct {
    ProductId: string;
    LocalizedProperties: LocalizedProperty[];
    MarketProperties: MarketProperty[];
    Properties: ProductProperties;
    DisplaySkuAvailabilities?: any[];
}

export interface LocalizedProperty {
    ProductTitle: string;
    ProductDescription: string;
    ShortDescription?: string;
    Images: ProductImage[];
}

export interface ProductImage {
    ImagePurpose: string;
    Uri: string;
    Height: number;
    Width: number;
}

export interface MarketProperty {
    ReleaseDate?: string;
    OriginalReleaseDate?: string;
}

export interface ProductProperties {
    Categories?: string[];
    Attributes?: Attribute[];
    ReleaseDate?: string;
}

export interface Attribute {
    Name: string;
    Minimum?: number;
    Maximum?: number;
}

// Cache types
export interface CachedEntry {
    timestamp: number;
    games: GameCard[];
}

export interface CacheStore {
    [key: string]: CachedEntry;
}

// Query options
export interface GamePassQueryOptions {
    platform?: 'console' | 'pc' | 'cloud' | 'eaplay' | 'all';
    market?: string;
    language?: string;
}
