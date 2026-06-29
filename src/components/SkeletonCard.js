import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

function SkeletonBox({ width, height, style, colors }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[{ width, height, borderRadius: 10, backgroundColor: colors.shimmer, opacity }, style]}
    />
  );
}

export default function SkeletonCard({ colors }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <SkeletonBox width="100%" height={200} style={{ borderRadius: 0 }} colors={colors} />
      <View style={styles.content}>
        <SkeletonBox width="70%" height={20} colors={colors} />
        <View style={styles.metaRow}>
          <SkeletonBox width={60} height={13} colors={colors} />
          <SkeletonBox width={80} height={13} colors={colors} />
          <SkeletonBox width={70} height={13} colors={colors} />
        </View>
        <View style={styles.footer}>
          <SkeletonBox width={120} height={24} colors={colors} />
          <SkeletonBox width={100} height={32} style={{ borderRadius: 10 }} colors={colors} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, marginBottom: 18, overflow: 'hidden', borderWidth: 1 },
  content: { padding: 16, gap: 10 },
  metaRow: { flexDirection: 'row', gap: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
});
