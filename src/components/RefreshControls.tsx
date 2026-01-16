import { useState, useEffect } from 'react';

interface RefreshControlsProps {
  lastRefreshed: number | null;
  refreshInterval: number;
  onIntervalChange: (interval: number) => void;
  onRefreshNow: () => void;
}

const INTERVAL_OPTIONS = [
  { value: 30000, label: '30 seconds' },
  { value: 60000, label: '1 minute' },
  { value: 120000, label: '2 minutes' },
  { value: 300000, label: '5 minutes' },
  { value: 600000, label: '10 minutes' },
];

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function RefreshControls({
  lastRefreshed,
  refreshInterval,
  onIntervalChange,
  onRefreshNow,
}: RefreshControlsProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!lastRefreshed) return;

    const updateTimeAgo = () => {
      setTimeAgo(formatTimeAgo(lastRefreshed));
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, [lastRefreshed]);

  return (
    <div className="refresh-controls">
      <div className="refresh-status">
        {lastRefreshed ? (
          <>
            <span className="refresh-label">Last updated:</span>
            <span className="refresh-time">{formatTime(lastRefreshed)}</span>
            <span className="refresh-ago">({timeAgo})</span>
          </>
        ) : (
          <span className="refresh-label">Loading...</span>
        )}
      </div>
      <div className="refresh-actions">
        <select
          value={refreshInterval}
          onChange={(e) => onIntervalChange(Number(e.target.value))}
          className="refresh-select"
        >
          {INTERVAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Every {option.label}
            </option>
          ))}
        </select>
        <button onClick={onRefreshNow} className="refresh-button">
          Refresh Now
        </button>
      </div>
    </div>
  );
}
