import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage, StorageKeys } from '../../utils/storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveStocks', () => {
    it('should save stocks to AsyncStorage', async () => {
      const mockStocks = [{ symbol: 'AAPL', price: 150 }];
      await storage.saveStocks(mockStocks);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.STOCKS_DATA,
        JSON.stringify(mockStocks)
      );
    });

    it('should handle errors when saving stocks', async () => {
      const mockError = new Error('Storage error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await storage.saveStocks([]);

      expect(consoleSpy).toHaveBeenCalledWith('Error saving stocks:', mockError);
      consoleSpy.mockRestore();
    });
  });

  describe('getFavorites', () => {
    it('should return favorites from AsyncStorage', async () => {
      const mockFavorites = ['AAPL', 'GOOGL'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockFavorites));

      const result = await storage.getFavorites();

      expect(result).toEqual(mockFavorites);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(StorageKeys.FAVORITES);
    });

    it('should return empty array when no favorites exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storage.getFavorites();

      expect(result).toEqual([]);
    });
  });
}); 