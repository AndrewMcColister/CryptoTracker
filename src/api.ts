import type { CryptoPrice, PriceHistory, TimeRange, NewsItem, FearGreedHistory, GlobalMarketData, TrendingCoin, GasPrice, HalvingData } from './types';

const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data';

// Coin metadata
const COIN_META: Record<string, { id: string; name: string; image: string }> = {
  BTC: {
    id: 'bitcoin',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  ETH: {
    id: 'ethereum',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  SOL: {
    id: 'solana',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  },
  ADA: {
    id: 'cardano',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  },
  DOT: {
    id: 'polkadot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  },
};

const SYMBOLS = Object.keys(COIN_META);

interface CryptoCompareRaw {
  PRICE: number;
  OPEN24HOUR: number;
  HIGH24HOUR: number;
  LOW24HOUR: number;
  CHANGE24HOUR: number;
  CHANGEPCT24HOUR: number;
  VOLUME24HOUR: number;
  VOLUME24HOURTO: number;
  MKTCAP: number;
  TOTALVOLUME24HTO: number;
}

export async function fetchPrices(): Promise<CryptoPrice[]> {
  const symbolsParam = SYMBOLS.join(',');
  const response = await fetch(
    `${CRYPTOCOMPARE_API}/pricemultifull?fsyms=${symbolsParam}&tsyms=USD`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch prices: ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === 'Error') {
    throw new Error(data.Message || 'Failed to fetch prices');
  }

  return SYMBOLS.map((symbol) => {
    const raw: CryptoCompareRaw = data.RAW?.[symbol]?.USD;
    const meta = COIN_META[symbol];

    if (!raw) {
      return {
        id: meta.id,
        symbol: symbol.toLowerCase(),
        name: meta.name,
        image: meta.image,
        current_price: 0,
        price_change_24h: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0,
        high_24h: 0,
        low_24h: 0,
        open_price: 0,
        bid_price: 0,
        ask_price: 0,
        trade_count: 0,
        weighted_avg_price: 0,
      };
    }

    return {
      id: meta.id,
      symbol: symbol.toLowerCase(),
      name: meta.name,
      image: meta.image,
      current_price: raw.PRICE,
      price_change_24h: raw.CHANGE24HOUR,
      price_change_percentage_24h: raw.CHANGEPCT24HOUR,
      market_cap: raw.MKTCAP || 0,
      total_volume: raw.VOLUME24HOURTO,
      high_24h: raw.HIGH24HOUR,
      low_24h: raw.LOW24HOUR,
      open_price: raw.OPEN24HOUR,
      bid_price: raw.PRICE * 0.9999, // CryptoCompare doesn't provide bid/ask, approximate
      ask_price: raw.PRICE * 1.0001,
      trade_count: 0, // Not available in CryptoCompare
      weighted_avg_price: (raw.HIGH24HOUR + raw.LOW24HOUR + raw.PRICE) / 3,
    };
  });
}

// Map our TimeRange to CryptoCompare params
function getHistoryParams(days: TimeRange): { endpoint: string; limit: number } {
  switch (days) {
    case '1':
      return { endpoint: 'histohour', limit: 24 };
    case '7':
      return { endpoint: 'histohour', limit: 168 };
    case '30':
      return { endpoint: 'histoday', limit: 30 };
    case '90':
      return { endpoint: 'histoday', limit: 90 };
    case '365':
      return { endpoint: 'histoday', limit: 365 };
    default:
      return { endpoint: 'histoday', limit: 30 };
  }
}

// Map coin ID to symbol
function coinIdToSymbol(coinId: string): string {
  const symbolMap: Record<string, string> = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    solana: 'SOL',
    cardano: 'ADA',
    polkadot: 'DOT',
  };
  return symbolMap[coinId] || coinId.toUpperCase();
}

export async function fetchPriceHistory(coinId: string, days: TimeRange): Promise<PriceHistory> {
  const symbol = coinIdToSymbol(coinId);
  const { endpoint, limit } = getHistoryParams(days);

  const response = await fetch(
    `${CRYPTOCOMPARE_API}/${endpoint}?fsym=${symbol}&tsym=USD&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch price history: ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === 'Error') {
    throw new Error(data.Message || 'Failed to fetch price history');
  }

  // CryptoCompare returns: { Data: { Data: [{ time, close, ... }] } }
  const historyData = data.Data?.Data || data.Data || [];

  const prices: [number, number][] = historyData.map((item: { time: number; close: number }) => [
    item.time * 1000, // Convert to milliseconds
    item.close,
  ]);

  return { prices };
}

export async function searchCoins(query: string): Promise<{ id: string; name: string; symbol: string }[]> {
  const lowerQuery = query.toLowerCase();
  return Object.entries(COIN_META)
    .filter(
      ([symbol, meta]) =>
        symbol.toLowerCase().includes(lowerQuery) ||
        meta.name.toLowerCase().includes(lowerQuery)
    )
    .map(([symbol, meta]) => ({
      id: meta.id,
      name: meta.name,
      symbol: symbol.toLowerCase(),
    }));
}

const NEWS_URL = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';

export async function fetchNews(): Promise<NewsItem[]> {
  const response = await fetch(NEWS_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();

  return data.Data.slice(0, 10).map((item: {
    id: string;
    title: string;
    url: string;
    source: string;
    published_on: number;
    imageurl: string;
  }) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    source: item.source,
    publishedAt: item.published_on * 1000,
    imageUrl: item.imageurl,
  }));
}

const FEAR_GREED_URL = 'https://api.alternative.me/fng/?limit=30';

export async function fetchFearGreed(): Promise<FearGreedHistory> {
  const response = await fetch(FEAR_GREED_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch Fear & Greed Index');
  }

  const data = await response.json();

  const history = data.data.map((item: { value: string; value_classification: string; timestamp: string }) => ({
    value: parseInt(item.value, 10),
    classification: item.value_classification,
    timestamp: parseInt(item.timestamp, 10) * 1000,
  }));

  return {
    current: history[0],
    history: history.reverse(), // Oldest first for charting
  };
}

// CoinGecko Global Market Data
export async function fetchGlobalMarket(): Promise<GlobalMarketData> {
  const response = await fetch('https://api.coingecko.com/api/v3/global');

  if (!response.ok) {
    throw new Error('Failed to fetch global market data');
  }

  const json = await response.json();
  const data = json.data;

  return {
    total_market_cap: data.total_market_cap.usd,
    total_volume_24h: data.total_volume.usd,
    btc_dominance: data.market_cap_percentage.btc,
    eth_dominance: data.market_cap_percentage.eth,
    market_cap_change_24h: data.market_cap_change_percentage_24h_usd,
    active_cryptocurrencies: data.active_cryptocurrencies,
  };
}

// CoinGecko Trending Coins
export async function fetchTrending(): Promise<TrendingCoin[]> {
  const response = await fetch('https://api.coingecko.com/api/v3/search/trending');

  if (!response.ok) {
    throw new Error('Failed to fetch trending coins');
  }

  const data = await response.json();

  return data.coins.slice(0, 7).map((item: {
    item: {
      id: string;
      name: string;
      symbol: string;
      thumb: string;
      market_cap_rank: number;
      price_btc: number;
      data: { price_change_percentage_24h: { usd: number } };
    };
  }) => ({
    id: item.item.id,
    name: item.item.name,
    symbol: item.item.symbol,
    thumb: item.item.thumb,
    market_cap_rank: item.item.market_cap_rank,
    price_btc: item.item.price_btc,
    price_change_24h: item.item.data?.price_change_percentage_24h?.usd || 0,
  }));
}

// Etherscan Gas Tracker
export async function fetchGasPrice(): Promise<GasPrice> {
  const response = await fetch('https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle');

  if (!response.ok) {
    throw new Error('Failed to fetch gas prices');
  }

  const data = await response.json();

  if (data.status !== '1') {
    throw new Error('Gas price API error');
  }

  return {
    safe: parseFloat(data.result.SafeGasPrice),
    standard: parseFloat(data.result.ProposeGasPrice),
    fast: parseFloat(data.result.FastGasPrice),
    baseFee: parseFloat(data.result.suggestBaseFee),
    lastBlock: parseInt(data.result.LastBlock, 10),
  };
}

// Bitcoin Halving Countdown
const HALVING_INTERVAL = 210000; // Blocks between halvings
const NEXT_HALVING_BLOCK = 1050000; // 5th halving (after 840000 in April 2024)
const AVG_BLOCK_TIME = 10; // Minutes

export async function fetchHalvingData(): Promise<HalvingData> {
  // Fetch current block height from blockchain.info
  const response = await fetch('https://blockchain.info/q/getblockcount');

  if (!response.ok) {
    throw new Error('Failed to fetch block height');
  }

  const currentBlock = parseInt(await response.text(), 10);
  const blocksRemaining = NEXT_HALVING_BLOCK - currentBlock;
  const minutesRemaining = blocksRemaining * AVG_BLOCK_TIME;
  const estimatedDate = new Date(Date.now() + minutesRemaining * 60 * 1000);
  const daysRemaining = Math.floor(minutesRemaining / (60 * 24));

  // Calculate progress since last halving (840000)
  const lastHalvingBlock = 840000;
  const blocksSinceLastHalving = currentBlock - lastHalvingBlock;
  const percentComplete = (blocksSinceLastHalving / HALVING_INTERVAL) * 100;

  return {
    currentBlock,
    halvingBlock: NEXT_HALVING_BLOCK,
    blocksRemaining,
    estimatedDate,
    daysRemaining,
    percentComplete: Math.min(percentComplete, 100),
  };
}
