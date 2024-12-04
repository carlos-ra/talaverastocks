import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  STOCKS_DATA: 'stocks_data',
  LAST_UPDATE: 'last_update',
  FAVORITES: 'favorite_stocks',
};

export const storage = {
  async saveStocks(stocks: any[]) {
    try {
      await AsyncStorage.setItem(StorageKeys.STOCKS_DATA, JSON.stringify(stocks));
    } catch (error) {
      console.error('Error saving stocks:', error);
    }
  },

  async saveLastUpdate(timestamp: string) {
    try {
      await AsyncStorage.setItem(StorageKeys.LAST_UPDATE, timestamp);
    } catch (error) {
      console.error('Error saving last update:', error);
    }
  },

  async getStocks() {
    try {
      const stocksData = await AsyncStorage.getItem(StorageKeys.STOCKS_DATA);
      return stocksData ? JSON.parse(stocksData) : null;
    } catch (error) {
      console.error('Error getting stocks:', error);
      return null;
    }
  },

  async getLastUpdate() {
    try {
      return await AsyncStorage.getItem(StorageKeys.LAST_UPDATE);
    } catch (error) {
      console.error('Error getting last update:', error);
      return null;
    }
  },

  async saveFavorites(symbols: string[]) {
    try {
      await AsyncStorage.setItem(StorageKeys.FAVORITES, JSON.stringify(symbols));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  async getFavorites() {
    try {
      const favorites = await AsyncStorage.getItem(StorageKeys.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },
}; 