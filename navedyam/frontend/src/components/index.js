// src/components/index.js — Shared UI components (enhanced)

import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../theme';

// ── Button ────────────────────────────────────────────────
export function Button({ title, onPress, loading, variant = 'primary', style, textStyle, icon }) {
  const bg = variant === 'primary'  ? COLORS.saffron
           : variant === 'outline'  ? 'transparent'
           : variant === 'green'    ? COLORS.green
           : variant === 'danger'   ? COLORS.error
           : COLORS.brown;

  const borderColor = variant === 'outline' ? COLORS.saffron : 'transparent';
  const color       = variant === 'outline' ? COLORS.saffron : COLORS.white;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.btn, { backgroundColor: bg, borderColor, borderWidth: variant === 'outline' ? 2 : 0, opacity: loading ? 0.7 : 1 }, style]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon && <Ionicons name={icon} size={18} color={color} />}
          <Text style={[styles.btnText, { color }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Input ──────────────────────────────────────────────────
export function Input({ label, style, inputStyle, error, leftIcon, ...props }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.inputWrap}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
        )}
        <TextInput
          placeholderTextColor={COLORS.textMuted}
          style={[styles.input, leftIcon && { paddingLeft: 0 }, inputStyle]}
          {...props}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

// ── VegBadge ──────────────────────────────────────────────
export function VegBadge({ isVeg }) {
  const color = isVeg ? COLORS.green : COLORS.error;
  return (
    <View style={[styles.vegBadge, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
}

// ── StatusPill ────────────────────────────────────────────
export function StatusPill({ status }) {
  const map = {
    placed:           { bg: '#FEF9C3', color: '#854D0E', label: 'Placed',      icon: 'receipt-outline' },
    confirmed:        { bg: '#DBEAFE', color: '#1D4ED8', label: 'Confirmed',   icon: 'checkmark-circle-outline' },
    preparing:        { bg: '#FEF3C7', color: '#92400E', label: 'Preparing',   icon: 'flame-outline' },
    out_for_delivery: { bg: '#D1FAE5', color: '#065F46', label: 'On the way',  icon: 'bicycle-outline' },
    delivered:        { bg: '#D1FAE5', color: '#065F46', label: 'Delivered',    icon: 'checkmark-done-outline' },
    cancelled:        { bg: '#FDECEA', color: '#C0392B', label: 'Cancelled',   icon: 'close-circle-outline' },
  };
  const { bg, color, label, icon } = map[status] || { bg: '#F3F4F6', color: '#374151', label: status, icon: 'help-circle-outline' };
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={12} color={color} style={{ marginRight: 4 }} />
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Divider ───────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// ── SectionHeader ─────────────────────────────────────────
export function SectionHeader({ title, subtitle, right }) {
  return (
    <View style={{ marginBottom: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSub}>{subtitle}</Text>}
      </View>
      {right && right}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.small,
  },
  btnText: {
    ...FONTS.bold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  inputLabel: {
    ...FONTS.semibold,
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.creamDark,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 13,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
    ...FONTS.regular,
  },
  inputError: {
    ...FONTS.medium,
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    ...SHADOW.small,
  },
  vegBadge: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 11,
    ...FONTS.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
