export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  open_price: number;
  bid_price: number;
  ask_price: number;
  trade_count: number;
  weighted_avg_price: number;
}

export interface PriceHistory {
  prices: [number, number][]; // [timestamp, price]
}

export interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  triggered: boolean;
  createdAt: number;
}

export type TimeRange = '1' | '7' | '30' | '90' | '365';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: number;
  imageUrl?: string;
}

export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: number;
}

export interface FearGreedHistory {
  current: FearGreedData;
  history: FearGreedData[];
}

export interface GlobalMarketData {
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
  eth_dominance: number;
  market_cap_change_24h: number;
  active_cryptocurrencies: number;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
  price_btc: number;
  price_change_24h: number;
}

export interface GasPrice {
  safe: number;
  standard: number;
  fast: number;
  baseFee: number;
  lastBlock: number;
}

export interface HalvingData {
  currentBlock: number;
  halvingBlock: number;
  blocksRemaining: number;
  estimatedDate: Date;
  daysRemaining: number;
  percentComplete: number;
}
