import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useState } from 'react';

import dummyData from '../resources/dummy_stock_data.json';
import { storage } from '../utils/storage';

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  daily_change: number;
}

interface StocksContextType {
  stocks: StockItem[];
  isLoading: boolean;
  isOnline: boolean;
  lastUpdate: string | null;
  favoriteSymbols: string[];
  toggleFavorite: (symbol: string) => void;
  refreshStocks: () => Promise<void>;
}

const StocksContext = createContext<StocksContextType | undefined>(undefined);

export function StocksProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    loadInitialData();

    return () => {
      unsubscribe();
    };
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const cachedStocks = await storage.getStocks();
      const cachedLastUpdate = await storage.getLastUpdate();
      const cachedFavorites = await storage.getFavorites();

      if (cachedStocks) {
        setStocks(cachedStocks);
        setLastUpdate(cachedLastUpdate);
        setFavoriteSymbols(cachedFavorites);
      } else {
        setStocks(dummyData.stocks);
        const currentTime = new Date().toISOString();
        setLastUpdate(currentTime);
        await storage.saveStocks(dummyData.stocks);
        await storage.saveLastUpdate(currentTime);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setStocks(dummyData.stocks);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStocks = async () => {
    if (!isOnline) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedStocks = dummyData.stocks.map((stock) => ({
        ...stock,
        price: stock.price * (1 + (Math.random() * 0.1 - 0.05)),
        daily_change: stock.price * (Math.random() * 0.06 - 0.03),
      }));

      setStocks(updatedStocks);
      const currentTime = new Date().toISOString();
      setLastUpdate(currentTime);

      await storage.saveStocks(updatedStocks);
      await storage.saveLastUpdate(currentTime);
    } catch (error) {
      console.error('Error refreshing stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (symbol: string) => {
    const newFavorites = favoriteSymbols.includes(symbol)
      ? favoriteSymbols.filter((s) => s !== symbol)
      : [...favoriteSymbols, symbol];

    setFavoriteSymbols(newFavorites);
    await storage.saveFavorites(newFavorites);
  };

  return (
    <StocksContext.Provider
      value={{
        stocks,
        isLoading,
        isOnline,
        lastUpdate,
        favoriteSymbols,
        toggleFavorite,
        refreshStocks,
      }}>
      {children}
    </StocksContext.Provider>
  );
}

export const useStocks = () => {
  const context = useContext(StocksContext);
  if (context === undefined) {
    throw new Error('useStocks must be used within a StocksProvider');
  }
  return context;
};
