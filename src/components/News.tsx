import type { NewsItem } from '../types';

interface NewsProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function News({ news, loading, error }: NewsProps) {
  if (loading) {
    return (
      <div className="card news-section">
        <h2>Latest News</h2>
        <div className="loading">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card news-section">
        <h2>Latest News</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="card news-section">
      <h2>Latest News</h2>
      <div className="news-list">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-item"
          >
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" className="news-image" />
            )}
            <div className="news-content">
              <div className="news-title">{item.title}</div>
              <div className="news-meta">
                <span className="news-source">{item.source}</span>
                <span className="news-time">{formatTimeAgo(item.publishedAt)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
