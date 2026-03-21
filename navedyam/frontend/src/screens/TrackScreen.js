// src/screens/TrackScreen.js — Enhanced with vector icons
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import { api, SOCKET_URL } from '../api/client';
import { Input, Button, StatusPill } from '../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

const STEP_ICONS = {
  placed:           'receipt-outline',
  confirmed:        'checkmark-circle-outline',
  preparing:        'flame-outline',
  out_for_delivery: 'bicycle-outline',
  delivered:        'checkmark-done-outline',
};

export default function TrackScreen({ route }) {
  const [orderId,  setOrderId]  = useState(route.params?.orderId || '');
  const [tracking, setTracking] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const socketRef = useRef(null);

  // Auto-track if navigated with an order ID
  useEffect(() => {
    if (route.params?.orderId) doTrack(route.params.orderId);
  }, [route.params?.orderId]);

  // Socket.IO: connect and listen for real-time updates
  useEffect(() => {
    if (!tracking?.order?.id) return;

    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.emit('join:order', tracking.order.id);

    socket.on('order:status_update', ({ status, steps, estimated_delivery }) => {
      setTracking(prev => prev ? {
        ...prev,
        order: { ...prev.order, status },
        steps: steps || prev.steps,
        estimated_delivery: estimated_delivery || prev.estimated_delivery,
      } : prev);
    });

    return () => {
      socket.emit('leave:order', tracking.order.id);
      socket.disconnect();
    };
  }, [tracking?.order?.id]);

  async function doTrack(id) {
    const trackId = id || orderId;
    if (!trackId.trim()) return Alert.alert('Enter Order ID', 'Please paste your order ID.');
    try {
      setLoading(true);
      const data = await api.trackOrder(trackId.trim());
      setTracking(data);
    } catch (err) {
      Alert.alert('Not Found', 'Order not found. Please check the ID.');
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    if (!tracking?.order?.id) return;
    try {
      setRefreshing(true);
      const data = await api.trackOrder(tracking.order.id);
      setTracking(data);
    } catch (_) {
      // silent fail on refresh
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.saffron]}
          tintColor={COLORS.saffron}
        />
      }
    >
      <View style={styles.body}>
        <View style={styles.searchRow}>
          <Input
            value={orderId}
            onChangeText={setOrderId}
            placeholder="Paste your Order ID here"
            leftIcon="search-outline"
            style={{ flex: 1, marginBottom: 0 }}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => doTrack()} activeOpacity={0.8}>
            <Ionicons name="navigate" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.saffron} />
            <Text style={{ color: COLORS.textMuted, marginTop: 10 }}>Fetching order...</Text>
          </View>
        )}

        {!loading && tracking && (
          <View style={styles.trackCard}>
            {/* Header */}
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{tracking.order.display_id || 'Order'}</Text>
                <Text style={styles.orderIdSub} numberOfLines={1} ellipsizeMode="middle">
                  {tracking.order.id}
                </Text>
              </View>
              <StatusPill status={tracking.order.status} />
            </View>

            {/* ETA */}
            {tracking.estimated_delivery && (
              <View style={styles.etaBanner}>
                <Ionicons name="time-outline" size={16} color={COLORS.brown} style={{ marginRight: 6 }} />
                <Text style={styles.etaText}>
                  ETA: {new Date(tracking.estimated_delivery).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              </View>
            )}

            {/* Items */}
            <View style={styles.itemsList}>
              {tracking.order.items.map((i, idx) => (
                <View key={idx} style={styles.trackItem}>
                  <Text style={styles.trackItemName}>{i.item_name}</Text>
                  <Text style={styles.trackItemQty}>x {i.quantity}</Text>
                </View>
              ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLbl}>Total Paid</Text>
              <Text style={styles.totalVal}>₹{tracking.order.total || tracking.order.grand_total}</Text>
            </View>

            {/* Steps */}
            <View style={{ marginTop: 20 }}>
              {tracking.steps.map((step, idx) => {
                const stepIcon = STEP_ICONS[step.key] || 'ellipse-outline';
                return (
                  <View key={step.key} style={styles.step}>
                    <View style={styles.stepLeft}>
                      <View style={[
                        styles.stepDot,
                        step.done   && styles.stepDotDone,
                        step.active && styles.stepDotActive,
                      ]}>
                        {step.done ? (
                          <Ionicons name="checkmark" size={16} color={COLORS.white} />
                        ) : step.active ? (
                          <Ionicons name={stepIcon} size={14} color={COLORS.white} />
                        ) : (
                          <Text style={styles.stepDotTxt}>{idx + 1}</Text>
                        )}
                      </View>
                      {idx < tracking.steps.length - 1 && (
                        <View style={[styles.stepLine, step.done && styles.stepLineDone]} />
                      )}
                    </View>
                    <View style={styles.stepBody}>
                      <Text style={[styles.stepName, (step.done || step.active) && { color: COLORS.text }]}>
                        {step.label}
                      </Text>
                      {(step.done || step.active) && (
                        <Text style={styles.stepDesc}>{step.desc}</Text>
                      )}
                      {step.active && step.eta && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                          <Ionicons name="time-outline" size={12} color={COLORS.turmeric} />
                          <Text style={styles.stepEta}>ETA: {step.eta}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.deliveryAddr}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.addrLabel}>Delivering to</Text>
              </View>
              <Text style={styles.addrVal}>{tracking.order.address}</Text>
            </View>
          </View>
        )}

        {!loading && !tracking && (
          <View style={styles.center}>
            <Ionicons name="cube-outline" size={56} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Track your order</Text>
            <Text style={styles.emptySub}>Enter your order ID above and tap Track</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  body:   { padding: 20 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 20 },
  searchBtn: {
    backgroundColor: COLORS.saffron, borderRadius: RADIUS.md,
    width: 48, height: 48, alignItems: 'center', justifyContent: 'center',
    ...SHADOW.small,
  },
  center: { alignItems: 'center', paddingVertical: 48 },
  trackCard: {
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.xl,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 20, ...SHADOW.medium,
  },
  orderHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 14,
  },
  orderId:    { fontSize: 18, ...FONTS.bold, color: COLORS.text },
  orderIdSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, maxWidth: 200 },
  etaBanner: {
    backgroundColor: COLORS.creamDark, borderRadius: RADIUS.md,
    padding: 10, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  etaText:   { fontSize: 14, ...FONTS.bold, color: COLORS.brown },
  itemsList: { backgroundColor: COLORS.creamDark, borderRadius: RADIUS.md, padding: 12, gap: 6 },
  trackItem: { flexDirection: 'row', justifyContent: 'space-between' },
  trackItemName: { fontSize: 13, color: COLORS.text, ...FONTS.medium },
  trackItemQty:  { fontSize: 13, color: COLORS.textMuted },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  totalLbl: { fontSize: 14, color: COLORS.textMuted },
  totalVal: { fontSize: 16, ...FONTS.bold, color: COLORS.saffronDeep },
  step:     { flexDirection: 'row', gap: 12, marginBottom: 0 },
  stepLeft: { alignItems: 'center', width: 32 },
  stepDot: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.creamDark,
    borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  stepDotDone:   { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  stepDotActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  stepDotTxt:    { fontSize: 12, ...FONTS.bold, color: COLORS.textMuted },
  stepLine:      { flex: 1, width: 2, backgroundColor: COLORS.border, marginVertical: 3, minHeight: 24 },
  stepLineDone:  { backgroundColor: COLORS.saffron },
  stepBody:      { flex: 1, paddingBottom: 20, paddingTop: 4 },
  stepName:      { fontSize: 14, ...FONTS.semibold, color: COLORS.textMuted },
  stepDesc:      { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  stepEta:       { fontSize: 12, color: COLORS.turmeric, ...FONTS.bold },
  deliveryAddr:  { marginTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
  addrLabel:     { fontSize: 12, color: COLORS.textMuted },
  addrVal:       { fontSize: 14, color: COLORS.text, ...FONTS.medium, marginLeft: 18 },
  emptyTitle:    { fontSize: 20, ...FONTS.bold, color: COLORS.text, marginTop: 12 },
  emptySub:      { fontSize: 13, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
});
