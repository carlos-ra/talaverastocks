import { useRouter } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { FavoriteButton } from '../components/FavoriteButton';
import stockData from '../resources/dummy_stock_data.json';

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  daily_change: number;
}

export default function StockListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const fadeAnim = new Animated.Value(0);

  const filteredAndSortedStocks = useCallback(() => {
    const result = stockData.stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === 'asc') {
      return result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      return result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, sortOrder]);

  const renderStockItem = ({ item, index }: { item: StockItem; index: number }) => {
    const slideAnim = new Animated.Value(50);
    const opacityAnim = new Animated.Value(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    const percentageChange = ((item.daily_change / item.price) * 100).toFixed(2);
    const isPositive = item.daily_change > 0;

    return (
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }}>
        <TouchableOpacity
          style={styles.stockItem}
          onPress={() =>
            router.push({
              pathname: '/stock/[symbol]',
              params: { symbol: item.symbol },
            })
          }>
          <View style={styles.stockInfo}>
            <View style={styles.symbolContainer}>
              <Text style={styles.stockName}>{item.name}</Text>
              <FavoriteButton symbol={item.symbol} size={16} style={styles.favoriteButton} />
            </View>
            <Text style={styles.stockSymbol}>{item.symbol}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text
              style={[styles.change, isPositive ? styles.positiveChange : styles.negativeChange]}>
              {isPositive ? '+' : ''}
              {percentageChange}%
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>Stock Market</Text>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search stocks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortOrder === 'asc' && styles.activeSort]}
            onPress={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}>
            <Text style={styles.sortButtonText}>↑ Price</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortOrder === 'desc' && styles.activeSort]}
            onPress={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}>
            <Text style={styles.sortButtonText}>↓ Price</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList<StockItem>
        data={filteredAndSortedStocks()}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol}
        style={styles.list}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSort: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginVertical: 1,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '500',
  },
  stockSymbol: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
  },
  change: {
    fontSize: 14,
    marginTop: 4,
  },
  positiveChange: {
    color: '#4CAF50',
  },
  negativeChange: {
    color: '#F44336',
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    padding: 4,
  },
});
