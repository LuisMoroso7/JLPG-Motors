import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function Screen({ children, style, noSafe = false }) {
  if (noSafe) {
    return <View style={[styles.container, style]}>{children}</View>;
  }
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
