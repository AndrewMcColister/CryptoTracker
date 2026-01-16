import type { HalvingData } from '../types';

interface HalvingCountdownProps {
  data: HalvingData | null;
  loading: boolean;
  error: string | null;
}

export function HalvingCountdown({ data, loading, error }: HalvingCountdownProps) {
  if (loading) {
    return (
      <div className="card halving">
        <h2>Bitcoin Halving</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card halving">
        <h2>Bitcoin Halving</h2>
        <div className="error">{error || 'No data'}</div>
      </div>
    );
  }

  const years = Math.floor(data.daysRemaining / 365);
  const months = Math.floor((data.daysRemaining % 365) / 30);
  const days = data.daysRemaining % 30;

  return (
    <div className="card halving">
      <h2>Bitcoin Halving Countdown</h2>

      <div className="halving-countdown">
        <div className="countdown-item">
          <span className="countdown-value">{years}</span>
          <span className="countdown-label">Years</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{months}</span>
          <span className="countdown-label">Months</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{days}</span>
          <span className="countdown-label">Days</span>
        </div>
      </div>

      <div className="halving-progress">
        <div className="progress-header">
          <span>Progress to Next Halving</span>
          <span>{data.percentComplete.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${data.percentComplete}%` }} />
        </div>
      </div>

      <div className="halving-details">
        <div className="halving-detail">
          <span className="detail-label">Current Block</span>
          <span className="detail-value">{data.currentBlock.toLocaleString()}</span>
        </div>
        <div className="halving-detail">
          <span className="detail-label">Halving Block</span>
          <span className="detail-value">{data.halvingBlock.toLocaleString()}</span>
        </div>
        <div className="halving-detail">
          <span className="detail-label">Blocks Remaining</span>
          <span className="detail-value">{data.blocksRemaining.toLocaleString()}</span>
        </div>
        <div className="halving-detail">
          <span className="detail-label">Est. Date</span>
          <span className="detail-value">
            {data.estimatedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="halving-info">
        Block reward will drop from 3.125 to 1.5625 BTC
      </div>
    </div>
  );
}
