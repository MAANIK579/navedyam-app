// src/screens/MenuScreen.js — Enhanced with shared components and pull-to-refresh
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { VegBadge } from '../components';
import HeartButton from '../components/HeartButton';
import StarRating from '../components/StarRating';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

export default function MenuScreen({ route, navigation }) {
  const { category: initialCat } = route.params || {};
  const { addItem, removeItem, getQty } = useCart();

  const [categories, setCategories] = useState([]);
  const [items,      setItems]      = useState([]);
  const [activeCat,  setActiveCat]  = useState(initialCat || 'all');
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load categories once
  useEffect(() => {
    api.getCategories()
      .then(d => setCategories([{ _id: 'all', name: 'All' }, ...d.categories]))
      .catch(() => {});
  }, []);

  // Header search button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{ marginRight: 16 }}>
          <Ionicons name="search-outline" size={22} color={COLORS.cream} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Load items when category changes
  const loadItems = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const params = activeCat !== 'all' ? { category: activeCat } : {};
      const data = await api.getMenuItems(params);
      setItems(data.items);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCat]);

  useEffect(() => { loadItems(); }, [loadItems]);

  function onRefresh() {
    setRefreshing(true);
    loadItems(true);
  }

  function renderItem({ item }) {
    const qty   = getQty(item._id || item.id);
    const itemId = item._id || item.id;
    return (
      <View style={styles.card}>
        <View style={styles.cardEmoji}>
          <Text style={{ fontSize: 48 }}>{item.emoji}</Text>
          <View style={styles.vegOverlay}>
            <VegBadge isVeg={item.is_veg === true || item.is_veg === 1} />
          </View>
          <View style={styles.heartOverlay}>
            <HeartButton itemId={itemId} size={20} />
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.avg_rating > 0 && (
            <View style={styles.ratingRow}>
              <StarRating rating={item.avg_rating} size={12} />
              {item.rating_count > 0 && (
                <Text style={styles.ratingCount}>({item.rating_count})</Text>
              )}
            </View>
          )}
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.price}>₹{item.price}</Text>
            {qty === 0 ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => addItem({ ...item, id: itemId })}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={16} color={COLORS.white} />
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyCtrl}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => removeItem(itemId)}>
                  <Ionicons name="remove" size={16} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{qty}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron }]}
                  onPress={() => addItem({ ...item, id: itemId })}
                >
                  <Ionicons name="add" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Category filter */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {categories.map(cat => {
          const isActive = activeCat === (cat._id || cat.id);
          return (
            <TouchableOpacity
              key={cat._id || cat.id}
              style={[styles.catBtn, isActive && styles.catBtnActive]}
              onPress={() => setActiveCat(cat._id || cat.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.catLabel, isActive && { color: COLORS.white }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.saffron} />
          <Text style={{ color: COLORS.textMuted, marginTop: 10, fontSize: 14 }}>Loading menu...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i._id || i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.saffron]}
              tintColor={COLORS.saffron}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="restaurant-outline" size={48} color={COLORS.border} />
              <Text style={{ color: COLORS.textMuted, marginTop: 10, fontSize: 15 }}>No items found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.cream },
  filterBar: { paddingVertical: 12, maxHeight: 60, backgroundColor: COLORS.white },
  catBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  catBtnActive: { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  catLabel: { fontSize: 13, ...FONTS.semibold, color: COLORS.textMuted },
  list: { padding: 16, gap: 14, paddingBottom: 24 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.borderLight,
    overflow: 'hidden', ...SHADOW.small,
  },
  cardEmoji: {
    height: 120, backgroundColor: COLORS.creamDark,
    alignItems: 'center', justifyContent: 'center',
  },
  vegOverlay: { position: 'absolute', top: 10, left: 10 },
  heartOverlay: { position: 'absolute', top: 8, right: 8 },
  cardBody:   { padding: 14 },
  itemName:   { fontSize: 16, ...FONTS.bold, color: COLORS.text, marginBottom: 4 },
  ratingRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  ratingCount: { fontSize: 11, color: COLORS.textMuted },
  itemDesc:   { fontSize: 13, color: COLORS.textMuted, lineHeight: 18, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:      { fontSize: 18, ...FONTS.bold, color: COLORS.saffronDeep },
  addBtn: {
    backgroundColor: COLORS.saffron,
    borderRadius: RADIUS.sm, paddingHorizontal: 16, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  addBtnText: { color: COLORS.white, ...FONTS.bold, fontSize: 13 },
  qtyCtrl:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyNum:     { fontSize: 16, ...FONTS.bold, minWidth: 22, textAlign: 'center' },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
});
