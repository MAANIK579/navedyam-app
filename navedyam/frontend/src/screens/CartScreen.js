// src/screens/CartScreen.js — Enhanced UI, COD only
import React, { useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Alert, ScrollView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Button } from '../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

export default function CartScreen({ navigation }) {
  const {
    cartItems, itemTotal, deliveryFee, gst, grandTotal, discount,
    appliedCoupon, couponError, couponLoading, applyCoupon, removeCoupon,
    addItem, removeItem, clearCart,
  } = useCart();
  const { user } = useAuth();

  const [address,     setAddress]     = useState(user?.addresses?.[0]?.full_address || '');
  const [notes,       setNotes]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [showCoupon,  setShowCoupon]  = useState(false);

  async function handlePlaceOrder() {
    if (cartItems.length === 0) return Alert.alert('Empty Cart', 'Add some items first!');
    if (!address.trim()) return Alert.alert('Address Required', 'Please enter a delivery address.');

    const orderPayload = {
      items: cartItems.map(({ item, qty }) => ({ item_id: item.id || item._id, quantity: qty })),
      address, notes,
      coupon_code:    appliedCoupon?.code || '',
      payment_method: 'cod',
    };

    try {
      setLoading(true);
      const data = await api.placeOrder(orderPayload);
      clearCart();
      Alert.alert(
        'Order Placed!',
        `Order ${data.order.display_id} is confirmed!\nEstimated delivery: 35-45 minutes`,
        [{ text: 'Track Order', onPress: () => navigation.navigate('Track', { orderId: data.order.id || data.order._id }) }]
      );
    } catch (err) {
      Alert.alert('Order Failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="cart-outline" size={64} color={COLORS.border} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add delicious Haryanvi food from our menu</Text>
        <Button title="Browse Menu" icon="restaurant-outline" onPress={() => navigation.navigate('Menu')} style={{ marginTop: 20, paddingHorizontal: 32 }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>

      {/* Items */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Items ({cartItems.length})</Text>
          <TouchableOpacity onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
          ])}>
            <Text style={{ fontSize: 13, color: COLORS.error, ...FONTS.medium }}>Clear All</Text>
          </TouchableOpacity>
        </View>
        {cartItems.map(({ item, qty }) => (
          <View key={item.id || item._id} style={styles.cartItem}>
            <Text style={{ fontSize: 32, width: 44, textAlign: 'center' }}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price * qty}</Text>
            </View>
            <View style={styles.qtyCtrl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => removeItem(item.id || item._id)}>
                <Ionicons name="remove" size={14} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron }]}
                onPress={() => addItem(item)}
              >
                <Ionicons name="add" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Delivery address */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Addresses', {
            selectMode: true,
            onSelect: (addr) => setAddress(addr.full_address),
          })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-outline" size={14} color={COLORS.saffron} />
              <Text style={styles.linkText}>Saved</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textArea}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter full delivery address in Bhiwani"
          placeholderTextColor={COLORS.textMuted}
          multiline numberOfLines={2}
        />
        <TextInput
          style={[styles.textArea, { marginTop: 10, minHeight: 44 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Special instructions (optional)"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />
      </View>

      {/* Coupon */}
      <View style={styles.section}>
        {appliedCoupon ? (
          <View style={styles.couponApplied}>
            <Ionicons name="pricetag" size={18} color={COLORS.green} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.couponCode}>{appliedCoupon.code}</Text>
              <Text style={styles.couponSaved}>You save ₹{appliedCoupon.discount}</Text>
            </View>
            <TouchableOpacity onPress={removeCoupon} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.couponRow} onPress={() => setShowCoupon(s => !s)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="pricetag-outline" size={18} color={COLORS.text} />
                <Text style={styles.couponLabel}>Apply Coupon</Text>
              </View>
              <Ionicons name={showCoupon ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.saffron} />
            </TouchableOpacity>
            {showCoupon && (
              <>
                <View style={styles.couponInput}>
                  <TextInput
                    style={styles.couponField}
                    value={couponInput}
                    onChangeText={t => setCouponInput(t.toUpperCase())}
                    placeholder="Enter coupon code"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={styles.couponApplyBtn}
                    onPress={() => { applyCoupon(couponInput); setShowCoupon(false); }}
                    disabled={couponLoading}
                  >
                    <Text style={styles.couponApplyTxt}>{couponLoading ? '...' : 'Apply'}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Coupon', {
                    cartTotal: itemTotal,
                    onApply: ({ code }) => { applyCoupon(code); setShowCoupon(false); },
                  })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}
                >
                  <Text style={styles.linkText}>Browse available coupons</Text>
                  <Ionicons name="arrow-forward" size={14} color={COLORS.saffron} />
                </TouchableOpacity>
              </>
            )}
            {!!couponError && <Text style={styles.couponError}>{couponError}</Text>}
          </>
        )}
      </View>

      {/* Payment info */}
      <View style={styles.section}>
        <View style={styles.payInfo}>
          <Ionicons name="cash-outline" size={20} color={COLORS.green} />
          <Text style={styles.payInfoText}>Cash on Delivery</Text>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
        </View>
      </View>

      {/* Order Summary */}
      <View style={[styles.section, styles.summaryCard]}>
        <Text style={[styles.sectionTitle, { color: COLORS.cream, marginBottom: 14 }]}>Order Summary</Text>
        {[['Item Total', `₹${itemTotal}`], ['Delivery Fee', `₹${deliveryFee}`], ['GST (5%)', `₹${gst}`]].map(([lbl, val]) => (
          <View key={lbl} style={styles.summaryRow}>
            <Text style={styles.summaryLbl}>{lbl}</Text>
            <Text style={styles.summaryVal}>{val}</Text>
          </View>
        ))}
        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLbl, { color: '#6EE7B7' }]}>Coupon Discount</Text>
            <Text style={[styles.summaryVal, { color: '#6EE7B7' }]}>-₹{discount}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLbl}>Total</Text>
          <Text style={styles.totalVal}>₹{grandTotal}</Text>
        </View>
        <Button
          title={loading ? 'Placing Order...' : 'Place Order'}
          icon={loading ? undefined : 'checkmark-circle-outline'}
          onPress={handlePlaceOrder}
          loading={loading}
          style={{ marginTop: 14 }}
        />
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: COLORS.cream },
  empty:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 22, ...FONTS.bold, color: COLORS.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: COLORS.textMuted, marginTop: 6, textAlign: 'center' },
  section: { margin: 16, marginBottom: 0 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  linkText: { fontSize: 13, color: COLORS.saffron, ...FONTS.semibold },
  textArea: {
    backgroundColor: COLORS.creamDark, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 12, fontSize: 14, color: COLORS.text,
    minHeight: 52, textAlignVertical: 'top',
  },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg, padding: 12, marginBottom: 10, ...SHADOW.small,
  },
  itemName:  { fontSize: 14, ...FONTS.semibold, color: COLORS.text },
  itemPrice: { fontSize: 15, ...FONTS.bold, color: COLORS.saffronDeep, marginTop: 2 },
  qtyCtrl:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.creamDark,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  qtyNum:    { fontSize: 15, ...FONTS.bold, minWidth: 20, textAlign: 'center' },
  couponRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderColor: COLORS.border,
  },
  couponLabel: { fontSize: 15, ...FONTS.medium, color: COLORS.text },
  couponInput: { flexDirection: 'row', gap: 8, marginTop: 12 },
  couponField: {
    flex: 1, backgroundColor: COLORS.creamDark, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 12, fontSize: 14, color: COLORS.text, letterSpacing: 1,
  },
  couponApplyBtn: {
    backgroundColor: COLORS.saffron, borderRadius: RADIUS.md,
    paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center',
  },
  couponApplyTxt: { color: COLORS.white, ...FONTS.bold, fontSize: 14 },
  couponError:    { fontSize: 12, color: COLORS.error, marginTop: 6 },
  couponApplied: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.greenPale,
    borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: '#A5D6A7',
  },
  couponCode:   { fontSize: 14, ...FONTS.bold, color: COLORS.green },
  couponSaved:  { fontSize: 12, color: COLORS.green, marginTop: 2 },
  payInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.greenPale, borderRadius: RADIUS.md,
    padding: 14, borderWidth: 1, borderColor: '#A5D6A7',
  },
  payInfoText: { flex: 1, fontSize: 15, ...FONTS.semibold, color: COLORS.green },
  summaryCard: {
    backgroundColor: COLORS.brown, borderRadius: RADIUS.xl,
    padding: 20, marginTop: 16, ...SHADOW.medium,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLbl: { color: '#C8A882', fontSize: 14 },
  summaryVal: { color: '#C8A882', fontSize: 14 },
  totalRow: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 10, marginTop: 4 },
  totalLbl:  { color: COLORS.cream, fontSize: 17, ...FONTS.bold },
  totalVal:  { color: COLORS.saffronLight, fontSize: 20, ...FONTS.bold },
});
