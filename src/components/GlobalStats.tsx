import type { GlobalMarketData } from '../types';

interface GlobalStatsProps {
  data: GlobalMarketData | null;
  loading: boolean;
  error: string | null;
}

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export function GlobalStats({ data, loading, error }: GlobalStatsProps) {
  if (loading) {
    return (
      <div className="card global-stats">
        <h2>Global Market</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card global-stats">
        <h2>Global Market</h2>
        <div className="error">{error || 'No data'}</div>
      </div>
    );
  }

  return (
    <div className="card global-stats">
      <h2>Global Market</h2>
      <div className="gs-grid">
        <div className="gs-item">
          <span className="gs-label">Total Market Cap</span>
          <span className="gs-value">{formatLargeNumber(data.total_market_cap)}</span>
          <span className={`gs-change ${data.market_cap_change_24h >= 0 ? 'positive' : 'negative'}`}>
            {data.market_cap_change_24h >= 0 ? '+' : ''}{data.market_cap_change_24h.toFixed(2)}%
          </span>
        </div>
        <div className="gs-item">
          <span className="gs-label">24h Volume</span>
          <span className="gs-value">{formatLargeNumber(data.total_volume_24h)}</span>
        </div>
        <div className="gs-item">
          <span className="gs-label">BTC Dominance</span>
          <div className="gs-dominance">
            <div className="dominance-bar">
              <div className="dominance-fill btc" style={{ width: `${data.btc_dominance}%` }} />
            </div>
            <span className="gs-value">{data.btc_dominance.toFixed(1)}%</span>
          </div>
        </div>
        <div className="gs-item">
          <span className="gs-label">ETH Dominance</span>
          <div className="gs-dominance">
            <div className="dominance-bar">
              <div className="dominance-fill eth" style={{ width: `${data.eth_dominance}%` }} />
            </div>
            <span className="gs-value">{data.eth_dominance.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      <div className="gs-footer">
        <span>{data.active_cryptocurrencies.toLocaleString()} active cryptocurrencies</span>
      </div>
    </div>
  );
}
