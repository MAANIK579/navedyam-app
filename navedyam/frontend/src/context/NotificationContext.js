// src/context/NotificationContext.js — Enhanced push notifications
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import { api } from '../api/client';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationContext = createContext(null);

function cleanupNotificationSubscription(subscription) {
  if (!subscription) return;

  // expo-notifications listeners expose remove() in current SDKs.
  if (typeof subscription.remove === 'function') {
    subscription.remove();
  }
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef(null);

  // Set navigation ref for deep linking from notifications
  const setNavigation = (nav) => {
    navigationRef.current = nav;
  };

  useEffect(() => {
    if (!user) return;

    // Register for push notifications
    registerForPushNotifications();

    // Fetch initial unread count
    fetchUnreadCount();

    // Listen for incoming notifications while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      handleNotificationPress(data);
    });

    return () => {
      cleanupNotificationSubscription(notificationListener.current);
      cleanupNotificationSubscription(responseListener.current);
    };
  }, [user]);

  async function fetchUnreadCount() {
    try {
      const data = await api.getNotifications(1);
      const unread = (data.notifications || []).filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      // Silent fail
    }
  }

  async function registerForPushNotifications() {
    try {
      // Check for existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: undefined, // Will use app.json's projectId
      });
      const token = tokenData.data;
      setExpoPushToken(token);

      // Save token to backend
      await api.savePushToken(token);

      // Configure Android channel
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'Navedyam Orders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#22C55E',
        });
      }
    } catch (err) {
      console.warn('Push notification registration failed:', err);
    }
  }

  function handleNotificationPress(data) {
    if (!navigationRef.current) return;

    // Navigate based on notification type
    if (data?.orderId) {
      navigationRef.current.navigate('MainTabs', {
        screen: 'Track',
        params: { orderId: data.orderId },
      });
    } else if (data?.type === 'promotion') {
      navigationRef.current.navigate('Coupon');
    } else {
      navigationRef.current.navigate('Notifications');
    }
  }

  function decrementUnread() {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  function clearUnread() {
    setUnreadCount(0);
  }

  return (
    <NotificationContext.Provider value={{
      unreadCount,
      expoPushToken,
      decrementUnread,
      clearUnread,
      setUnreadCount,
      setNavigation,
      refreshUnreadCount: fetchUnreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
