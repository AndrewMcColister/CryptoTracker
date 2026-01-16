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

import { useState } from 'react';

export function PriceChart({ coinId, coinName }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const { history, loading, error } = usePriceHistory(coinId, timeRange);

  const chartData = history?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="#8b949e"
              tick={{ fill: '#8b949e' }}
              tickLine={{ stroke: '#8b949e' }}
            />
            <YAxis
              stroke="#8b949e"
              tick={{ fill: '#8b949e' }}
              tickLine={{ stroke: '#8b949e' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['auto', 'auto']}
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
      )}
    </div>
  );
}
