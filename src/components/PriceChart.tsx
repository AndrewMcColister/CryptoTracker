import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeRange } from '../types';
import { usePriceHistory } from '../hooks';

interface PriceChartProps {
  coinId: string;
  coinName: string;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
  { value: '90', label: '90D' },
  { value: '365', label: '1Y' },
];

export function PriceChart({ coinId, coinName }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const { history, loading, error } = usePriceHistory(coinId, timeRange);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = history?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    price,
  }));

  return (
    <div className="card chart-container">
      <div className="chart-header">
        <h2>{coinName} Price Chart</h2>
        <div className="chart-controls">
          {TIME_RANGES.map(({ value, label }) => (
            <button
              key={value}
              className={timeRange === value ? 'active' : ''}
              onClick={() => setTimeRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading chart data...</div>}
      {error && <div className="error">{error}</div>}

      {chartData && !loading && (
        <div style={{ width: '100%', height: isMobile ? 200 : 300, overflow: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: isMobile ? -10 : 0, bottom: 5 }}>
              <XAxis
                dataKey="date"
                stroke="#8b949e"
                tick={{ fill: '#8b949e', fontSize: isMobile ? 10 : 12 }}
                tickLine={{ stroke: '#8b949e' }}
                interval={isMobile ? 'preserveStartEnd' : 'equidistantPreserveStart'}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 50 : 30}
              />
              <YAxis
                stroke="#8b949e"
                tick={{ fill: '#8b949e', fontSize: isMobile ? 10 : 12 }}
                tickLine={{ stroke: '#8b949e' }}
                tickFormatter={(value) => isMobile ? `$${(value/1000).toFixed(0)}k` : `$${value.toLocaleString()}`}
                domain={['auto', 'auto']}
                width={isMobile ? 45 : 60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: '#f0f6fc' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#58a6ff"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
