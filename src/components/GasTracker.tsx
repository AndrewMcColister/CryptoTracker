import type { GasPrice } from '../types';

interface GasTrackerProps {
  data: GasPrice | null;
  loading: boolean;
  error: string | null;
}

function getGasLevel(gwei: number): 'low' | 'medium' | 'high' {
  if (gwei < 20) return 'low';
  if (gwei < 50) return 'medium';
  return 'high';
}

export function GasTracker({ data, loading, error }: GasTrackerProps) {
  if (loading) {
    return (
      <div className="card gas-tracker">
        <h2>ETH Gas Tracker</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card gas-tracker">
        <h2>ETH Gas Tracker</h2>
        <div className="error">{error || 'No data'}</div>
      </div>
    );
  }

  return (
    <div className="card gas-tracker">
      <h2>ETH Gas Tracker</h2>
      <div className="gas-grid">
        <div className={`gas-item ${getGasLevel(data.safe)}`}>
          <span className="gas-icon">🐢</span>
          <span className="gas-label">Safe</span>
          <span className="gas-value">{data.safe.toFixed(2)}</span>
          <span className="gas-unit">Gwei</span>
        </div>
        <div className={`gas-item ${getGasLevel(data.standard)}`}>
          <span className="gas-icon">🚗</span>
          <span className="gas-label">Standard</span>
          <span className="gas-value">{data.standard.toFixed(2)}</span>
          <span className="gas-unit">Gwei</span>
        </div>
        <div className={`gas-item ${getGasLevel(data.fast)}`}>
          <span className="gas-icon">🚀</span>
          <span className="gas-label">Fast</span>
          <span className="gas-value">{data.fast.toFixed(2)}</span>
          <span className="gas-unit">Gwei</span>
        </div>
      </div>
      <div className="gas-footer">
        <span>Base Fee: {data.baseFee.toFixed(2)} Gwei</span>
        <span>Block: #{data.lastBlock.toLocaleString()}</span>
      </div>
    </div>
  );
}
