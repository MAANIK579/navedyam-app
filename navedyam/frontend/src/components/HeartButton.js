// src/components/HeartButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS } from '../theme';

export default function HeartButton({ itemId, style, size = 20 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(itemId);

  return (
    <TouchableOpacity
      onPress={() => toggleFavorite(itemId)}
      activeOpacity={0.7}
      style={[styles.btn, style]}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
    >
      <Ionicons
        name={favorited ? 'heart' : 'heart-outline'}
        size={size}
        color={favorited ? '#E53E3E' : COLORS.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
});
