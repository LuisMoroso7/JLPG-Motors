import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function VehicleCard({ vehicle, onPress, onFavorite, isFavorite }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageContainer}>
        {vehicle.image ? (
          <Image source={{ uri: vehicle.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.emptyImage]}>
            <Ionicons name="car-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyImageText}>Sem imagem</Text>
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(10,10,15,0.85)']}
          style={styles.imageGradient}
        />

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{vehicle.category}</Text>
        </View>

        <Pressable onPress={onFavorite} style={styles.favoriteButton} hitSlop={12}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? colors.danger : '#fff'}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{vehicle.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.muted} />
            <Text style={styles.metaText}>{vehicle.year}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={13} color={colors.muted} />
            <Text style={styles.metaText}>{vehicle.km.toLocaleString('pt-BR')} km</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="git-branch-outline" size={13} color={colors.muted} />
            <Text style={styles.metaText}>{vehicle.transmission}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(vehicle.price)}</Text>
          <View style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Ver detalhes</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
  },
  emptyImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    gap: 8,
  },
  emptyImageText: {
    color: colors.muted,
    fontWeight: '700',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(201,162,39,0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    padding: 16,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201,162,39,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.25)',
  },
  detailsBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
