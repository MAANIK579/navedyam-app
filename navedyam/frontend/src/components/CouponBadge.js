// src/components/CouponBadge.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS } from '../theme';

export default function CouponBadge({ code, discount, onRemove }) {
  return (
    <View style={styles.badge}>
      <Ionicons name="pricetag" size={14} color={COLORS.green} style={{ marginRight: 6 }} />
      <Text style={styles.text}>
        {code} · -₹{discount}
      </Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.removeBtn}>
          <Ionicons name="close-circle" size={16} color={COLORS.green} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  text: {
    ...FONTS.semibold,
    fontSize: 13,
    color: COLORS.green,
    letterSpacing: 0.3,
  },
  removeBtn: {
    marginLeft: 8,
    padding: 2,
  },
});
