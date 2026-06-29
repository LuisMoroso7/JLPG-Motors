import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function PrimaryButton({ title, onPress, variant = 'primary', style, loading = false, disabled = false }) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [styles.base, pressed && styles.pressed, isDisabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={isDisabled ? [colors.muted, colors.muted] : [colors.primaryLight, colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Text style={styles.textPrimary}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isOutline && styles.outline,
        isDanger && styles.danger,
        isGhost && styles.ghost,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isDanger ? '#fff' : colors.primary} size="small" />
      ) : (
        <Text style={[
          styles.text,
          isOutline && styles.textOutline,
          isDanger && styles.textDanger,
          isGhost && styles.textGhost,
        ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  textPrimary: {
    color: '#0A0A0F',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  text: {
    fontWeight: '800',
    fontSize: 15,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  textOutline: {
    color: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  textDanger: {
    color: '#fff',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  textGhost: {
    color: colors.muted,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
