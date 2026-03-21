// src/screens/HomeScreen.js — Enhanced professional UI
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

const OFFERS = [
  { icon: 'gift-outline',    title: 'New User Offer', desc: 'Get Rs.50 off on your first order  ·  Use: WELCOME50', color: '#FEF3C7', accent: '#D97706' },
  { icon: 'fast-food-outline', title: 'Combo Deal',   desc: 'Thali + Lassi at just Rs.199',                         color: '#D1FAE5', accent: '#059669' },
  { icon: 'car-outline',     title: 'Free Delivery',  desc: 'On orders above Rs.299  ·  Use: FREEDELIVERY',          color: '#DBEAFE', accent: '#2563EB' },
];

const QUICK_CATS = [
  { id: 'thali',     label: 'Thali',     icon: 'grid-outline',       bg: '#FEF3C7' },
  { id: 'dal-sabzi', label: 'Dal Sabzi', icon: 'leaf-outline',       bg: '#D1FAE5' },
  { id: 'roti',      label: 'Roti',      icon: 'pizza-outline',      bg: '#FEE2E2' },
  { id: 'nonveg',    label: 'Non-Veg',   icon: 'flame-outline',      bg: '#FFE4E6' },
  { id: 'snacks',    label: 'Snacks',    icon: 'cafe-outline',       bg: '#DBEAFE' },
  { id: 'dessert',   label: 'Dessert',   icon: 'ice-cream-outline',  bg: '#F3E8FF' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Guest';

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brown} />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Namaskar, {firstName}!</Text>
            <Text style={styles.heroTitle}>Ghar Ka Swaad,{'\n'}Seedha Aapke Darwaze</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.cream} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroSub}>Authentic Haryanvi food · Bhiwani</Text>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.6)" />
          <Text style={styles.searchPlaceholder}>Search for thali, dal, roti...</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          {[
            { icon: 'time-outline',        val: '30-45', lbl: 'Min Delivery' },
            { icon: 'star-outline',         val: '4.8',  lbl: 'Rating' },
            { icon: 'bag-check-outline',    val: '2000+', lbl: 'Orders' },
          ].map(s => (
            <View key={s.lbl} style={styles.stat}>
              <Ionicons name={s.icon} size={16} color={COLORS.saffronLight} style={{ marginBottom: 2 }} />
              <Text style={styles.statNum}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.orderNowBtn}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.85}
        >
          <Ionicons name="restaurant-outline" size={20} color={COLORS.white} />
          <Text style={styles.orderNowText}>Order Now</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Quick categories */}
        <Text style={styles.sectionLabel}>Browse by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {QUICK_CATS.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catChip}
              onPress={() => navigation.navigate('Menu', { category: cat.id })}
              activeOpacity={0.8}
            >
              <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={22} color={COLORS.brown} />
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Offers */}
        <Text style={styles.sectionLabel}>Today's Offers</Text>
        {OFFERS.map(o => (
          <View key={o.title} style={[styles.offerCard, { backgroundColor: o.color }]}>
            <View style={[styles.offerIconWrap, { backgroundColor: o.accent + '20' }]}>
              <Ionicons name={o.icon} size={22} color={o.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.offerTitle, { color: o.accent }]}>{o.title}</Text>
              <Text style={styles.offerDesc}>{o.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={o.accent} />
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="leaf-outline" size={16} color={COLORS.green} style={{ marginBottom: 6 }} />
          <Text style={styles.footerText}>Pure ingredients · Made fresh daily · Bhiwani, Haryana</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  hero: {
    backgroundColor: COLORS.brown,
    padding: 24, paddingTop: 52, paddingBottom: 28,
  },
  heroHeader: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  },
  greeting: { color: COLORS.turmeric, fontSize: 14, ...FONTS.medium, letterSpacing: 0.5 },
  heroTitle: { color: COLORS.cream, fontSize: 26, ...FONTS.heavy, marginTop: 6, lineHeight: 34 },
  heroSub:   { color: '#A08060', fontSize: 13, marginTop: 4, marginBottom: 18 },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 20,
  },
  searchPlaceholder: { color: 'rgba(255,255,255,0.5)', fontSize: 14, ...FONTS.regular },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 22 },
  stat:     { alignItems: 'center' },
  statNum:  { color: COLORS.saffronLight, fontSize: 20, ...FONTS.bold },
  statLbl:  { color: '#A08060', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginTop: 1 },
  orderNowBtn: {
    backgroundColor: COLORS.saffron, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center', ...SHADOW.medium,
    flexDirection: 'row', justifyContent: 'center', gap: 10,
  },
  orderNowText: { color: COLORS.white, fontSize: 16, ...FONTS.bold },
  body: { padding: 20 },
  sectionLabel: { fontSize: 18, ...FONTS.bold, color: COLORS.text, marginBottom: 14 },
  catChip: {
    alignItems: 'center',
    marginRight: 12, minWidth: 72,
  },
  catIconWrap: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, ...SHADOW.small,
  },
  catLabel: { fontSize: 12, ...FONTS.semibold, color: COLORS.text },
  offerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: RADIUS.lg, padding: 14, marginBottom: 10,
  },
  offerIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  offerTitle: { fontSize: 14, ...FONTS.bold },
  offerDesc:  { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  footer: {
    marginTop: 20, padding: 16,
    backgroundColor: COLORS.creamDark, borderRadius: RADIUS.lg, alignItems: 'center',
  },
  footerText: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
