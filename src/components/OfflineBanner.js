import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OfflineBanner({ visible = false, message = 'Backend indisponivel - usando dados locais' }) {
  const translateY = useRef(new Animated.Value(-70)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -70,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999,
    backgroundColor: '#E5484D', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingVertical: 10, paddingTop: 50,
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
