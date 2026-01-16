import type { TrendingCoin } from '../types';

interface TrendingProps {
  coins: TrendingCoin[];
  loading: boolean;
  error: string | null;
}

export function Trending({ coins, loading, error }: TrendingProps) {
  if (loading) {
    return (
      <div className="card trending">
        <h2>Trending</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card trending">
        <h2>Trending</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="card trending">
      <h2>Trending</h2>
      <div className="trending-list">
        {coins.map((coin, index) => (
          <div key={coin.id} className="trending-item">
            <span className="trending-rank">#{index + 1}</span>
            <img src={coin.thumb} alt={coin.name} className="trending-icon" />
            <div className="trending-info">
              <span className="trending-name">{coin.name}</span>
              <span className="trending-symbol">{coin.symbol}</span>
            </div>
            <div className="trending-stats">
              {coin.market_cap_rank && (
                <span className="trending-mcap">Rank #{coin.market_cap_rank}</span>
              )}
              <span className={`trending-change ${coin.price_change_24h >= 0 ? 'positive' : 'negative'}`}>
                {coin.price_change_24h >= 0 ? '+' : ''}{coin.price_change_24h.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
