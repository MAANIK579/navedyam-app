// App.js — Root navigation with auth flow (enhanced with vector icons)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth }            from './src/context/AuthContext';
import { CartProvider, useCart }            from './src/context/CartContext';
import { FavoritesProvider }                from './src/context/FavoritesContext';
import { NotificationProvider, useNotifications } from './src/context/NotificationContext';

// Auth screens
import LoginScreen    from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Main tab screens
import HomeScreen    from './src/screens/HomeScreen';
import MenuScreen    from './src/screens/MenuScreen';
import CartScreen    from './src/screens/CartScreen';
import TrackScreen   from './src/screens/TrackScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Stack screens
import SearchScreen         from './src/screens/SearchScreen';
import FavoritesScreen      from './src/screens/FavoritesScreen';
import AddressesScreen      from './src/screens/AddressesScreen';
import AddAddressScreen     from './src/screens/AddAddressScreen';
import PaymentScreen        from './src/screens/PaymentScreen';
import OrderDetailScreen    from './src/screens/OrderDetailScreen';
import ReviewScreen         from './src/screens/ReviewScreen';
import NotificationsScreen  from './src/screens/NotificationsScreen';
import CouponScreen         from './src/screens/CouponScreen';

import { COLORS, FONTS } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TAB_ICONS = {
  Home:    { focused: 'home',       unfocused: 'home-outline' },
  Menu:    { focused: 'restaurant', unfocused: 'restaurant-outline' },
  Cart:    { focused: 'cart',       unfocused: 'cart-outline' },
  Track:   { focused: 'location',   unfocused: 'location-outline' },
  Profile: { focused: 'person',     unfocused: 'person-outline' },
};

function TabIcon({ routeName, focused, badgeCount }) {
  const icons = TAB_ICONS[routeName] || TAB_ICONS.Home;
  const iconName = focused ? icons.focused : icons.unfocused;
  const color = focused ? COLORS.saffronLight : '#A08060';

  return (
    <View style={{ alignItems: 'center', position: 'relative' }}>
      <Ionicons name={iconName} size={24} color={color} />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
    </View>
  );
}

function MainTabs() {
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();

  const screenOpts = {
    tabBarStyle: {
      backgroundColor: COLORS.brown,
      borderTopColor: 'rgba(255,255,255,0.08)',
      height: 64, paddingBottom: 8, paddingTop: 4,
    },
    tabBarActiveTintColor:   COLORS.saffronLight,
    tabBarInactiveTintColor: '#A08060',
    tabBarLabelStyle:        { ...FONTS.semibold, fontSize: 11 },
    headerStyle:             { backgroundColor: COLORS.brown },
    headerTitleStyle:        { color: COLORS.cream, ...FONTS.bold, fontSize: 18 },
    headerTintColor:         COLORS.cream,
  };

  return (
    <Tab.Navigator screenOptions={screenOpts}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon routeName="Home" focused={focused} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen name="Menu" component={MenuScreen}
        options={{
          title: 'Menu',
          tabBarIcon: ({ focused }) => <TabIcon routeName="Menu" focused={focused} />,
          tabBarLabel: 'Menu',
        }}
      />
      <Tab.Screen name="Cart" component={CartScreen}
        options={{
          title: 'Your Cart',
          tabBarIcon: ({ focused }) => <TabIcon routeName="Cart" focused={focused} badgeCount={itemCount} />,
          tabBarLabel: 'Cart',
        }}
      />
      <Tab.Screen name="Track" component={TrackScreen}
        options={{
          title: 'Track Order',
          tabBarIcon: ({ focused }) => <TabIcon routeName="Track" focused={focused} />,
          tabBarLabel: 'Track',
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon routeName="Profile" focused={focused} badgeCount={unreadCount} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

const commonHeader = {
  headerStyle:      { backgroundColor: COLORS.brown },
  headerTitleStyle: { color: COLORS.cream, ...FONTS.bold },
  headerTintColor:  COLORS.cream,
};

function AppStack() {
  return (
    <Stack.Navigator screenOptions={commonHeader}>
      <Stack.Screen name="MainTabs"      component={MainTabs}           options={{ headerShown: false }} />
      <Stack.Screen name="Search"        component={SearchScreen}       options={{ title: 'Search' }} />
      <Stack.Screen name="Favorites"     component={FavoritesScreen}    options={{ title: 'My Favourites' }} />
      <Stack.Screen name="Addresses"     component={AddressesScreen}    options={{ title: 'Saved Addresses' }} />
      <Stack.Screen name="AddAddress"    component={AddAddressScreen}   options={{ title: 'Add Address' }} />
      <Stack.Screen name="Payment"       component={PaymentScreen}      options={{ title: 'Payment' }} />
      <Stack.Screen name="OrderDetail"   component={OrderDetailScreen}  options={{ title: 'Order Details' }} />
      <Stack.Screen name="Review"        component={ReviewScreen}       options={{ title: 'Rate Your Order' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Coupon"        component={CouponScreen}       options={{ title: 'Apply Coupon' }} />
      <Stack.Screen name="MyReviews"     component={ReviewScreen}       options={{ title: 'My Reviews' }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <Ionicons name="flame" size={56} color={COLORS.saffron} />
        <Text style={styles.splashTitle}>Navedyam</Text>
        <Text style={styles.splashSub}>CLOUD KITCHEN  ·  BHIWANI</Text>
        <ActivityIndicator color={COLORS.saffronLight} style={{ marginTop: 32 }} size="large" />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FavoritesProvider>
          <CartProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1, backgroundColor: COLORS.brown,
    alignItems: 'center', justifyContent: 'center',
  },
  splashTitle: { color: COLORS.cream, fontSize: 36, ...FONTS.heavy, letterSpacing: 1, marginTop: 16 },
  splashSub:   { color: COLORS.turmeric, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 },
  badge: {
    position: 'absolute', top: -6, right: -12,
    backgroundColor: COLORS.saffron, borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 4,
    borderWidth: 2, borderColor: COLORS.brown,
  },
  badgeTxt: { color: COLORS.white, fontSize: 9, ...FONTS.bold },
});
