import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

import { FavoriteButton } from '../../components/FavoriteButton';
import stockData from '../../resources/dummy_stock_data.json';

export default function StockDetailsScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const stock = stockData.stocks.find((s) => s.symbol === symbol);

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!stock) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Stock not found</Text>
      </View>
    );
  }

  const percentageChange = ((stock.daily_change / stock.price) * 100).toFixed(2);
  const isPositive = stock.daily_change > 0;

  return (
    <Animated.ScrollView
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <FavoriteButton symbol={stock.symbol} size={28} />
        </View>
        <Text style={styles.name}>{stock.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Current Price</Text>
        <Text style={styles.price}>${stock.price.toFixed(2)}</Text>

        <View style={styles.changeContainer}>
          <Text style={styles.label}>Daily Change</Text>
          <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
            {isPositive ? '+' : ''}
            {stock.daily_change.toFixed(2)} ({percentageChange}%)
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Market Statistics</Text>
        <View style={styles.statRow}>
          <Text style={styles.label}>Opening Price</Text>
          <Text style={styles.value}>${(stock.price - stock.daily_change).toFixed(2)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.label}>Current Price</Text>
          <Text style={styles.value}>${stock.price.toFixed(2)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.label}>Daily Change ($)</Text>
          <Text style={[styles.value, isPositive ? styles.positive : styles.negative]}>
            {isPositive ? '+' : ''}
            {stock.daily_change.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.label}>Daily Change (%)</Text>
          <Text style={[styles.value, isPositive ? styles.positive : styles.negative]}>
            {isPositive ? '+' : ''}
            {percentageChange}%
          </Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
    margin: 12,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  changeContainer: {
    marginTop: 8,
  },
  change: {
    fontSize: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
