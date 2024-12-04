import { View, Text, StyleSheet } from 'react-native';

import { useStocks } from '../context/StocksContext';

export function ConnectionStatus() {
  const { isOnline, lastUpdate } = useStocks();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Offline Mode - Last updated: {new Date(lastUpdate || '').toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f44336',
    padding: 8,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});
