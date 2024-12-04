import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { useStocks } from '../context/StocksContext';

interface FavoriteButtonProps {
  symbol: string;
  size?: number;
  style?: object;
}

export function FavoriteButton({ symbol, size = 24, style }: FavoriteButtonProps) {
  const { favoriteSymbols, toggleFavorite } = useStocks();
  const isFavorite = favoriteSymbols.includes(symbol);

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={() => toggleFavorite(symbol)}>
      <Ionicons
        name={isFavorite ? 'star' : 'star-outline'}
        size={size}
        color={isFavorite ? '#FFD700' : '#666'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
