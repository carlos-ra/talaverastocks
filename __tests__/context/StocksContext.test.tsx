import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { render, act, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { StocksProvider, useStocks } from '../../context/StocksContext';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-community/netinfo');

const TestComponent = () => {
  const { stocks, isLoading, favoriteSymbols, toggleFavorite } = useStocks();
  return (
    <>
      <Text testID="loading">{isLoading.toString()}</Text>
      <Text testID="stocksCount">{stocks.length}</Text>
      <Text testID="favoritesCount">{favoriteSymbols.length}</Text>
      <Text testID="firstStock">{stocks[0]?.symbol}</Text>
    </>
  );
};

describe('StocksContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty state and load data', async () => {
    const mockStocks = [{ symbol: 'AAPL', name: 'Apple Inc.', price: 150, daily_change: 2.5 }];

    AsyncStorage.getItem
      .mockImplementationOnce(() => Promise.resolve(JSON.stringify(mockStocks)))
      .mockImplementationOnce(() => Promise.resolve(null))
      .mockImplementationOnce(() => Promise.resolve('[]'));

    const { getByTestId } = render(
      <StocksProvider>
        <TestComponent />
      </StocksProvider>
    );

    expect(getByTestId('loading').props.children).toBe('true');

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
      expect(getByTestId('stocksCount').props.children).toBe(1);
      expect(getByTestId('firstStock').props.children).toBe('AAPL');
    });
  });

  it('should handle offline mode', async () => {
    NetInfo.addEventListener.mockImplementation((callback) => {
      callback({ isConnected: false });
      return () => {};
    });

    const { getByTestId } = render(
      <StocksProvider>
        <TestComponent />
      </StocksProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });
  });
});
