import type { CryptoPrice } from '../types';

interface MarketStatsProps {
  coin: CryptoPrice | undefined;
}

function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(decimals)}K`;
  }
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: decimals })}`;
}

function formatPrice(price: number): string {
  if (price >= 1) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toFixed(6)}`;
}

export function MarketStats({ coin }: MarketStatsProps) {
  if (!coin) {
    return (
      <div className="card market-stats">
        <h2>Market Stats</h2>
        <div className="loading">Select a coin</div>
      </div>
    );
  }

  const priceRange = coin.high_24h - coin.low_24h;
  const pricePosition = priceRange > 0
    ? ((coin.current_price - coin.low_24h) / priceRange) * 100
    : 50;

  const spread = coin.ask_price - coin.bid_price;
  const spreadPercent = (spread / coin.current_price) * 100;

  return (
    <div className="card market-stats">
      <h2>Market Stats - {coin.name}</h2>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">24h Volume</span>
          <span className="stat-value">{formatNumber(coin.total_volume)}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">24h Trades</span>
          <span className="stat-value">{coin.trade_count.toLocaleString()}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">24h Change</span>
          <span className={`stat-value ${coin.price_change_24h >= 0 ? 'positive' : 'negative'}`}>
            {coin.price_change_24h >= 0 ? '+' : ''}{formatPrice(coin.price_change_24h)}
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Weighted Avg</span>
          <span className="stat-value">{formatPrice(coin.weighted_avg_price)}</span>
        </div>
      </div>

      <div className="price-range">
        <div className="range-header">
          <span>24h Range</span>
        </div>
        <div className="range-bar">
          <div className="range-fill" style={{ width: `${pricePosition}%` }} />
          <div className="range-marker" style={{ left: `${pricePosition}%` }} />
        </div>
        <div className="range-labels">
          <span className="range-low">{formatPrice(coin.low_24h)}</span>
          <span className="range-high">{formatPrice(coin.high_24h)}</span>
        </div>
      </div>

      <div className="bid-ask">
        <div className="bid-ask-header">
          <span>Bid / Ask Spread</span>
          <span className="spread-percent">{spreadPercent.toFixed(4)}%</span>
        </div>
        <div className="bid-ask-values">
          <div className="bid">
            <span className="ba-label">Bid</span>
            <span className="ba-value">{formatPrice(coin.bid_price)}</span>
          </div>
          <div className="spread-indicator">
            <span>{formatPrice(spread)}</span>
          </div>
          <div className="ask">
            <span className="ba-label">Ask</span>
            <span className="ba-value">{formatPrice(coin.ask_price)}</span>
          </div>
        </div>
      </div>

      <div className="stat-item open-price">
        <span className="stat-label">Open Price (24h ago)</span>
        <span className="stat-value">{formatPrice(coin.open_price)}</span>
      </div>
    </div>
  );
}
