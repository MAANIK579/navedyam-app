// src/screens/PaymentScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';
import { Divider } from '../components';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';

export default function PaymentScreen({ navigation, route }) {
  const { orderSummary, orderParams } = route.params || {};
  const { clearCart } = useCart();

  const [method, setMethod]   = useState('cod');
  const [placing, setPlacing] = useState(false);

  const summary = orderSummary || {
    itemTotal:   0,
    deliveryFee: 30,
    gst:         0,
    discount:    0,
    grandTotal:  0,
  };

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const payload = { ...(orderParams || {}), payment_method: method };
      const data = await api.placeOrder(payload);
      const orderId = data.order?._id || data.order?.id || data.orderId;

      if (method === 'razorpay') {
        await api.createPaymentOrder(orderId);
        Alert.alert(
          'Razorpay Integration',
          'Payment integration ready — contact developer for Razorpay live keys',
          [{
            text: 'Continue',
            onPress: () => {
              clearCart();
              navigation.replace('Track', { orderId });
            },
          }]
        );
      } else {
        clearCart();
        navigation.replace('Track', { orderId });
      }
    } catch (err) {
      Alert.alert('Order Failed', err.message || 'Could not place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Order summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Item Total</Text>
              <Text style={styles.rowValue}>₹{summary.itemTotal}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Delivery Fee</Text>
              <Text style={styles.rowValue}>₹{summary.deliveryFee}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>GST (5%)</Text>
              <Text style={styles.rowValue}>₹{summary.gst}</Text>
            </View>
            {summary.discount > 0 && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Discount</Text>
                <Text style={[styles.rowValue, styles.discount]}>-₹{summary.discount}</Text>
              </View>
            )}
            <Divider style={{ marginVertical: 10 }} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{summary.grandTotal}</Text>
            </View>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* COD */}
          <TouchableOpacity
            style={[styles.methodCard, method === 'cod' && styles.methodCardActive]}
            onPress={() => setMethod('cod')}
            activeOpacity={0.8}
          >
            <View style={styles.methodLeft}>
              <Text style={styles.methodIcon}>💵</Text>
              <View>
                <Text style={styles.methodTitle}>Cash on Delivery</Text>
                <Text style={styles.methodSub}>Pay when your order arrives</Text>
              </View>
            </View>
            <View style={[styles.radio, method === 'cod' && styles.radioActive]}>
              {method === 'cod' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* Razorpay */}
          <TouchableOpacity
            style={[styles.methodCard, method === 'razorpay' && styles.methodCardActive]}
            onPress={() => setMethod('razorpay')}
            activeOpacity={0.8}
          >
            <View style={styles.methodLeft}>
              <Text style={styles.methodIcon}>🔒</Text>
              <View>
                <Text style={styles.methodTitle}>Razorpay</Text>
                <Text style={styles.methodSub}>Pay securely via Razorpay</Text>
              </View>
            </View>
            <View style={[styles.radio, method === 'razorpay' && styles.radioActive]}>
              {method === 'razorpay' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Place Order button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeBtn, placing && { opacity: 0.75 }]}
          onPress={handlePlaceOrder}
          disabled={placing}
          activeOpacity={0.85}
        >
          {placing
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.placeBtnText}>Place Order · ₹{summary.grandTotal}</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.saffron,
    ...FONTS.bold,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: 14,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOW.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  rowValue: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
  },
  discount: {
    color: COLORS.green,
  },
  totalLabel: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  totalValue: {
    ...FONTS.heavy,
    fontSize: 18,
    color: COLORS.saffron,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.small,
  },
  methodCardActive: {
    borderColor: COLORS.saffron,
    backgroundColor: '#FFF8F2',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  methodIcon: {
    fontSize: 28,
  },
  methodTitle: {
    ...FONTS.semibold,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 2,
  },
  methodSub: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.saffron,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.saffron,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.medium,
  },
  placeBtn: {
    backgroundColor: COLORS.saffron,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeBtnText: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
