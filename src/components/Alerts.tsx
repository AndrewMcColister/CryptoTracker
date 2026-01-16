import { useState } from 'react';
import type { Alert, CryptoPrice } from '../types';

interface AlertsProps {
  alerts: Alert[];
  prices: CryptoPrice[];
  onAddAlert: (coinId: string, coinName: string, targetPrice: number, condition: 'above' | 'below') => void;
  onRemoveAlert: (id: string) => void;
}

export function Alerts({ alerts, prices, onAddAlert, onRemoveAlert }: AlertsProps) {
  const [selectedCoin, setSelectedCoin] = useState(prices[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coin = prices.find((p) => p.id === selectedCoin);
    if (!coin || !targetPrice) return;

    onAddAlert(selectedCoin, coin.name, parseFloat(targetPrice), condition);
    setTargetPrice('');
  };

  return (
    <div className="card alerts-section">
      <h2>Price Alerts</h2>
      <form className="alert-form" onSubmit={handleSubmit}>
        <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
          {prices.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value as 'above' | 'below')}>
          <option value="above">Goes above</option>
          <option value="below">Goes below</option>
        </select>
        <input
          type="number"
          placeholder="Target price (USD)"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          step="0.01"
          min="0"
        />
        <button type="submit">Add Alert</button>
      </form>

      <div className="alert-list">
        {alerts.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
            No alerts set. Create one above!
          </p>
        )}
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.triggered ? 'triggered' : ''}`}>
            <span>
              {alert.coinName} {alert.condition} ${alert.targetPrice.toLocaleString()}
              {alert.triggered && ' (Triggered!)'}
            </span>
            <button className="alert-delete" onClick={() => onRemoveAlert(alert.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
