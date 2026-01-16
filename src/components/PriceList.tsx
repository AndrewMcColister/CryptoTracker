import type { CryptoPrice } from '../types';

interface PriceListProps {
  prices: CryptoPrice[];
  onSelectCoin: (coinId: string) => void;
  selectedCoin: string;
}

export function PriceList({ prices, onSelectCoin, selectedCoin }: PriceListProps) {
  return (
    <div className="card">
      <h2>Live Prices</h2>
      <div className="price-list">
        {prices.map((coin) => (
          <div
            key={coin.id}
            className="price-item"
            onClick={() => onSelectCoin(coin.id)}
            style={{
              cursor: 'pointer',
              outline: selectedCoin === coin.id ? '2px solid var(--accent-blue)' : 'none',
            }}
          >
            <div className="coin-info">
              <img src={coin.image} alt={coin.name} className="coin-icon" />
              <div>
                <div className="coin-name">{coin.name}</div>
                <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
              </div>
            </div>
            <div className="price-info">
              <div className="price">${coin.current_price.toLocaleString()}</div>
              <div
                className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}
              >
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
