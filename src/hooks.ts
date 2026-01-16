import { useState, useEffect, useCallback, useRef } from 'react';
import type { CryptoPrice, PriceHistory, Alert, TimeRange, NewsItem, FearGreedHistory, GlobalMarketData, TrendingCoin, GasPrice, HalvingData } from './types';
import { fetchPrices, fetchPriceHistory, fetchNews, fetchFearGreed, fetchGlobalMarket, fetchTrending, fetchGasPrice, fetchHalvingData } from './api';

export function usePrices(refreshInterval: number) {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchPrices();
      setPrices(data);
      setError(null);
      setLastRefreshed(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(refresh, refreshInterval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, refreshInterval]);

  return { prices, loading, error, refresh, lastRefreshed };
}

export function usePriceHistory(coinId: string, days: TimeRange) {
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPriceHistory(coinId, days)
      .then((data) => {
        setHistory(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch history');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coinId, days]);

  return { history, loading, error };
}

const ALERTS_KEY = 'crypto-tracker-alerts';

export function useAlerts(prices: CryptoPrice[]) {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem(ALERTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if (prices.length === 0) return;

    setAlerts((current) =>
      current.map((alert) => {
        if (alert.triggered) return alert;

        const coin = prices.find((p) => p.id === alert.coinId);
        if (!coin) return alert;

        const shouldTrigger =
          (alert.condition === 'above' && coin.current_price >= alert.targetPrice) ||
          (alert.condition === 'below' && coin.current_price <= alert.targetPrice);

        if (shouldTrigger) {
          setNotification(
            `${alert.coinName} is now ${alert.condition} $${alert.targetPrice.toLocaleString()}`
          );
          setTimeout(() => setNotification(null), 5000);
          return { ...alert, triggered: true };
        }

        return alert;
      })
    );
  }, [prices]);

  const addAlert = useCallback(
    (coinId: string, coinName: string, targetPrice: number, condition: 'above' | 'below') => {
      const newAlert: Alert = {
        id: crypto.randomUUID(),
        coinId,
        coinName,
        targetPrice,
        condition,
        triggered: false,
        createdAt: Date.now(),
      };
      setAlerts((current) => [...current, newAlert]);
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((current) => current.filter((a) => a.id !== id));
  }, []);

  return { alerts, addAlert, removeAlert, notification };
}

export function useNews(refreshInterval: number) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchNews();
      setNews(data);
      setError(null);
      setLastRefreshed(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(refresh, refreshInterval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refresh, refreshInterval]);

  return { news, loading, error, refresh, lastRefreshed };
}

export function useFearGreed() {
  const [data, setData] = useState<FearGreedHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFearGreed();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Fear & Greed Index');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Fear & Greed updates once daily, so refresh every hour
    const interval = setInterval(refresh, 3600000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, loading, error, refresh };
}

export function useGlobalMarket(refreshInterval: number) {
  const [data, setData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchGlobalMarket();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch global market');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(refresh, refreshInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh, refreshInterval]);

  return { data, loading, error, refresh };
}

export function useTrending() {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchTrending();
      setCoins(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Trending updates less frequently
    const interval = setInterval(refresh, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [refresh]);

  return { coins, loading, error, refresh };
}

export function useGasPrice() {
  const [data, setData] = useState<GasPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchGasPrice();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gas prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Gas prices update every 15 seconds
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, loading, error, refresh };
}

export function useHalving() {
  const [data, setData] = useState<HalvingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchHalvingData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch halving data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Block height updates every ~10 minutes
    const interval = setInterval(refresh, 600000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, loading, error, refresh };
}
