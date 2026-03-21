// src/screens/ProfileScreen.js — Enhanced UI
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Button, Input, StatusPill, Card, Divider } from '../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateProfile } = useAuth();
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing,    setEditing]    = useState(false);
  const [name,       setName]       = useState(user?.name || '');
  const [saving,     setSaving]     = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const d = await api.getMyOrders();
      setOrders(d.orders || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  function onRefresh() {
    setRefreshing(true);
    loadOrders();
  }

  async function handleSave() {
    try {
      setSaving(true);
      await updateProfile({ name });
      setEditing(false);
      Alert.alert('Saved', 'Profile updated!');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const QUICK_LINKS = [
    { icon: 'location-outline',      label: 'Saved Addresses', screen: 'Addresses',    color: COLORS.saffron },
    { icon: 'heart-outline',         label: 'My Favourites',   screen: 'Favorites',    color: '#E53E3E' },
    { icon: 'notifications-outline', label: 'Notifications',   screen: 'Notifications', color: '#3B82F6' },
    { icon: 'star-outline',          label: 'My Reviews',      screen: 'MyReviews',    color: '#F59E0B' },
  ];

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.saffron]} tintColor={COLORS.saffron} />
      }
    >
      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <Ionicons name="call-outline" size={12} color="#C8A882" />
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setEditing(e => !e)} style={styles.editBtn}>
          <Ionicons name={editing ? 'close' : 'create-outline'} size={16} color={COLORS.cream} />
          <Text style={styles.editBtnTxt}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {editing && (
          <Card style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <Input label="Name" leftIcon="person-outline" value={name} onChangeText={setName} placeholder="Your full name" />
            <Button title="Save Changes" icon="checkmark-outline" onPress={handleSave} loading={saving} />
          </Card>
        )}

        {/* Quick links */}
        <View style={styles.quickLinks}>
          {QUICK_LINKS.map(({ icon, label, screen, color }) => (
            <TouchableOpacity
              key={screen}
              style={styles.quickLink}
              onPress={() => navigation.navigate(screen)}
            >
              <View style={[styles.quickLinkIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
              </View>
              <Text style={styles.quickLinkLabel}>{label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'bag-outline',            val: orders.length, lbl: 'Total Orders', color: COLORS.saffron },
            { icon: 'checkmark-done-outline',  val: orders.filter(o => o.status === 'delivered').length, lbl: 'Delivered', color: COLORS.green },
            { icon: 'close-circle-outline',    val: orders.filter(o => o.status === 'cancelled').length, lbl: 'Cancelled', color: COLORS.error },
          ].map(({ icon, val, lbl, color }) => (
            <View key={lbl} style={styles.statCard}>
              <Ionicons name={icon} size={20} color={color} />
              <Text style={styles.statNum}>{val}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Order History */}
        <Text style={styles.sectionTitle}>Order History</Text>
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={COLORS.saffron} /></View>
        ) : orders.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={36} color={COLORS.border} />
            <Text style={styles.emptyTxt}>No orders yet. Go order some food!</Text>
          </Card>
        ) : (
          orders.map(order => (
            <TouchableOpacity
              key={order._id || order.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderDetail', { orderId: order._id || order.id })}
              activeOpacity={0.8}
            >
              <View style={styles.orderTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderId}>{order.display_id || 'Order'}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={styles.orderTotal}>₹{order.grand_total || order.total}</Text>
                  <StatusPill status={order.status} />
                </View>
              </View>
              {order.items?.length > 0 && (
                <>
                  <Divider />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.orderItemsList} numberOfLines={1}>
                      {order.items.map(i => `${i.item_name} x${i.quantity}`).join('  ·  ')}
                    </Text>
                    <TouchableOpacity
                      style={styles.reorderBtn}
                      onPress={async (e) => {
                        e.stopPropagation && e.stopPropagation();
                        try {
                          await api.reorder(order._id || order.id);
                          Alert.alert('Reordered!', 'New order placed successfully.');
                          navigation.navigate('Track');
                        } catch (err) {
                          Alert.alert('Error', err.message);
                        }
                      }}
                    >
                      <Ionicons name="refresh-outline" size={12} color={COLORS.white} />
                      <Text style={styles.reorderTxt}>Reorder</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </TouchableOpacity>
          ))
        )}

        <Button
          title="Logout"
          variant="outline"
          icon="log-out-outline"
          onPress={handleLogout}
          style={{ marginTop: 24, borderColor: COLORS.error }}
          textStyle={{ color: COLORS.error }}
        />
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  hero: {
    backgroundColor: COLORS.brown, padding: 24, paddingTop: 52,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center',
    ...SHADOW.medium,
  },
  avatarText: { color: COLORS.white, fontSize: 22, ...FONTS.bold },
  userName:   { color: COLORS.cream, fontSize: 18, ...FONTS.bold },
  userPhone:  { color: '#C8A882', fontSize: 13 },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  editBtnTxt: { color: COLORS.cream, fontSize: 13, ...FONTS.medium },
  body: { padding: 16 },
  quickLinks: {
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.borderLight,
    marginBottom: 16, ...SHADOW.small, overflow: 'hidden',
  },
  quickLink: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  quickLinkIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLinkLabel: { flex: 1, fontSize: 15, ...FONTS.medium, color: COLORS.text },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.borderLight,
    padding: 14, alignItems: 'center', gap: 4, ...SHADOW.small,
  },
  statNum: { fontSize: 20, ...FONTS.bold, color: COLORS.text },
  statLbl: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
  sectionTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.text, marginBottom: 12 },
  center: { alignItems: 'center', paddingVertical: 24 },
  emptyCard: { alignItems: 'center', padding: 24 },
  emptyTxt: { color: COLORS.textMuted, fontSize: 14, marginTop: 8, textAlign: 'center' },
  orderCard: {
    backgroundColor: COLORS.cardBg, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.borderLight, padding: 14, marginBottom: 10, ...SHADOW.small,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId:   { fontSize: 14, ...FONTS.bold, color: COLORS.text },
  orderDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  orderTotal: { fontSize: 17, ...FONTS.bold, color: COLORS.saffronDeep },
  orderItemsList: { fontSize: 12, color: COLORS.textMuted, flex: 1 },
  reorderBtn: {
    backgroundColor: COLORS.saffron, borderRadius: RADIUS.sm,
    paddingHorizontal: 10, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  reorderTxt: { color: COLORS.white, fontSize: 11, ...FONTS.bold },
});
