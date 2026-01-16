import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { FearGreedHistory } from '../types';

interface FearGreedIndexProps {
  data: FearGreedHistory | null;
  loading: boolean;
  error: string | null;
}

function getColor(value: number): string {
  if (value <= 25) return '#ea3943'; // Extreme Fear - red
  if (value <= 45) return '#ea8c00'; // Fear - orange
  if (value <= 55) return '#f3d42f'; // Neutral - yellow
  if (value <= 75) return '#93c47d'; // Greed - light green
  return '#16c784'; // Extreme Greed - green
}

function getGradientId(value: number): string {
  if (value <= 25) return 'extremeFear';
  if (value <= 45) return 'fear';
  if (value <= 55) return 'neutral';
  if (value <= 75) return 'greed';
  return 'extremeGreed';
}

export function FearGreedIndex({ data, loading, error }: FearGreedIndexProps) {
  if (loading) {
    return (
      <div className="card fear-greed">
        <h2>Fear & Greed Index</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card fear-greed">
        <h2>Fear & Greed Index</h2>
        <div className="error">{error || 'No data available'}</div>
      </div>
    );
  }

  const { current, history } = data;
  const gaugeRotation = (current.value / 100) * 180 - 90; // -90 to 90 degrees

  const chartData = history.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: item.value,
    classification: item.classification,
  }));

  return (
    <div className="card fear-greed">
      <h2>Fear & Greed Index</h2>

      <div className="fg-content">
        <div className="fg-gauge-container">
          <div className="fg-gauge">
            <div className="fg-gauge-bg" />
            <div
              className="fg-gauge-needle"
              style={{ transform: `rotate(${gaugeRotation}deg)` }}
            />
            <div className="fg-gauge-center">
              <span className="fg-value" style={{ color: getColor(current.value) }}>
                {current.value}
              </span>
              <span className="fg-label">{current.classification}</span>
            </div>
          </div>
          <div className="fg-scale">
            <span>Extreme Fear</span>
            <span>Extreme Greed</span>
          </div>
        </div>

        <div className="fg-chart">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColor(current.value)} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={getColor(current.value)} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#8b949e"
                tick={{ fill: '#8b949e', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#8b949e"
                tick={{ fill: '#8b949e', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#f0f6fc' }}
                formatter={(value: number, _name: string, props: { payload: { classification: string } }) => [
                  `${value} - ${props.payload.classification}`,
                  'Index',
                ]}
              />
              <ReferenceLine y={50} stroke="#30363d" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke={getColor(current.value)}
                strokeWidth={2}
                fill="url(#fgGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
