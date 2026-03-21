// src/screens/LoginScreen.js — Enhanced UI
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!phone || !password) {
      Alert.alert('Missing fields', 'Please enter your phone and password.');
      return;
    }
    try {
      setLoading(true);
      await login(phone, password);
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.brown }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoIcon}>
            <Ionicons name="flame" size={36} color={COLORS.white} />
          </View>
          <Text style={styles.logoText}>Navedyam</Text>
          <Text style={styles.logoSub}>CLOUD KITCHEN · BHIWANI</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to order fresh Haryanvi food</Text>

          <Input
            label="Phone Number"
            leftIcon="call-outline"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            autoComplete="tel"
          />
          <Input
            label="Password"
            leftIcon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
          />

          <Button title="Login" icon="log-in-outline" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.switchLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: COLORS.saffron,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    ...SHADOW.medium,
  },
  logoText: {
    fontSize: 34, color: COLORS.cream,
    ...FONTS.heavy, letterSpacing: 1,
  },
  logoSub: {
    fontSize: 10, color: COLORS.turmeric,
    letterSpacing: 3, textTransform: 'uppercase',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: 24,
    ...SHADOW.large,
  },
  title: {
    fontSize: 24, ...FONTS.bold, color: COLORS.text, marginBottom: 4,
  },
  subtitle: {
    fontSize: 14, color: COLORS.textMuted, marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 20,
  },
  switchText: { color: COLORS.textMuted, fontSize: 14 },
  switchLink: { color: COLORS.saffron, fontSize: 14, ...FONTS.bold },
});
