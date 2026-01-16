import { useState } from 'react';
import { usePrices, useAlerts, useNews, useFearGreed, useGlobalMarket, useTrending, useGasPrice, useHalving } from './hooks';
import { PriceList } from './components/PriceList';
import { PriceChart } from './components/PriceChart';
import { Alerts } from './components/Alerts';
import { News } from './components/News';
import { RefreshControls } from './components/RefreshControls';
import { MarketStats } from './components/MarketStats';
import { FearGreedIndex } from './components/FearGreedIndex';
import { GlobalStats } from './components/GlobalStats';
import { Trending } from './components/Trending';
import { GasTracker } from './components/GasTracker';
import { HalvingCountdown } from './components/HalvingCountdown';

const DEFAULT_REFRESH_INTERVAL = 300000; // 5 minutes

function App() {
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);
  const { prices, loading, error, refresh, lastRefreshed } = usePrices(refreshInterval);
  const { alerts, addAlert, removeAlert, notification } = useAlerts(prices);
  const { news, loading: newsLoading, error: newsError } = useNews(refreshInterval);
  const { data: fearGreedData, loading: fgLoading, error: fgError } = useFearGreed();
  const { data: globalData, loading: globalLoading, error: globalError } = useGlobalMarket(refreshInterval);
  const { coins: trendingCoins, loading: trendingLoading, error: trendingError } = useTrending();
  const { data: gasData, loading: gasLoading, error: gasError } = useGasPrice();
  const { data: halvingData, loading: halvingLoading, error: halvingError } = useHalving();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  const selectedCoinData = prices.find((p) => p.id === selectedCoin);

  if (loading && prices.length === 0) {
    return (
      <div className="app">
        <div className="loading">Loading cryptocurrency data...</div>
      </div>
    );
  }

  if (error && prices.length === 0) {
    return (
      <div className="app">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      {notification && <div className="notification">{notification}</div>}

      <header className="header">
        <h1>CryptoTracker</h1>
        <p>Real-time cryptocurrency prices, charts, and alerts</p>
      </header>

      <RefreshControls
        lastRefreshed={lastRefreshed}
        refreshInterval={refreshInterval}
        onIntervalChange={setRefreshInterval}
        onRefreshNow={refresh}
      />

      <div className="dashboard">
        <GlobalStats
          data={globalData}
          loading={globalLoading}
          error={globalError}
        />

        <PriceList
          prices={prices}
          onSelectCoin={setSelectedCoin}
          selectedCoin={selectedCoin}
        />

        <MarketStats coin={selectedCoinData} />

        <PriceChart
          coinId={selectedCoin}
          coinName={selectedCoinData?.name || 'Bitcoin'}
        />

        <FearGreedIndex
          data={fearGreedData}
          loading={fgLoading}
          error={fgError}
        />

        <Trending
          coins={trendingCoins}
          loading={trendingLoading}
          error={trendingError}
        />

        <GasTracker
          data={gasData}
          loading={gasLoading}
          error={gasError}
        />

        <HalvingCountdown
          data={halvingData}
          loading={halvingLoading}
          error={halvingError}
        />

        <Alerts
          alerts={alerts}
          prices={prices}
          onAddAlert={addAlert}
          onRemoveAlert={removeAlert}
        />

        <News
          news={news}
          loading={newsLoading}
          error={newsError}
        />
      </div>
    </div>
  );
}

export default App;
