import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function getBadge(vehicle) {
  if (vehicle.stock === 1 && vehicle.km < 5000) return { label: 'Novo', color: colors.success };
  if (vehicle.km < 30000) return { label: 'Seminovo', color: colors.info };
  if (vehicle.stock === 1) return { label: 'Última unidade', color: colors.danger };
  if (vehicle.featured) return { label: 'Destaque', color: colors.primary };
  return null;
}

export default function VehicleCard({ vehicle, onPress, onFavorite, isFavorite, compact = false, selected = false, onSelect }) {
  const badge = getBadge(vehicle);

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.compactCard, selected && styles.compactSelected, pressed && styles.pressed]}
      >
        {vehicle.image ? (
          <Image source={{ uri: vehicle.image }} style={styles.compactImage} />
        ) : (
          <View style={[styles.compactImage, styles.emptyImage]}>
            <Ionicons name="car-outline" size={28} color={colors.muted} />
          </View>
        )}
        <LinearGradient colors={['transparent', 'rgba(10,10,15,0.9)']} style={styles.compactGradient} />
        {selected && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          </View>
        )}
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>{vehicle.name}</Text>
          <Text style={styles.compactPrice}>{formatCurrency(vehicle.price, vehicle.targetCurrency || 'BRL')}</Text>
        </View>
      </Pressable>
    );
  }

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
        <LinearGradient colors={['transparent', 'rgba(10,10,15,0.85)']} style={styles.imageGradient} />

        {/* Badges */}
        <View style={styles.topRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{vehicle.category}</Text>
          </View>
          <View style={styles.rightBadges}>
            {badge && (
              <View style={[styles.badge, { borderColor: badge.color, backgroundColor: `${badge.color}22` }]}>
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Fotos count */}
        {vehicle.images?.length > 1 && (
          <View style={styles.photoCount}>
            <Ionicons name="images-outline" size={11} color="#fff" />
            <Text style={styles.photoCountText}>{vehicle.images.length} fotos</Text>
          </View>
        )}

        <Pressable onPress={onFavorite} style={styles.favoriteButton} hitSlop={12}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? colors.danger : '#fff'} />
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
            <Text style={styles.metaText}>{Number(vehicle.km || 0).toLocaleString('pt-BR')} km</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="git-branch-outline" size={13} color={colors.muted} />
            <Text style={styles.metaText}>{vehicle.transmission}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(vehicle.price, vehicle.targetCurrency || 'BRL')}</Text>
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
    backgroundColor: colors.card, borderRadius: 20, marginBottom: 18,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 200 },
  emptyImage: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, gap: 8 },
  emptyImageText: { color: colors.muted, fontWeight: '700' },
  imageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  topRow: { position: 'absolute', top: 12, left: 12, right: 50, flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  categoryBadge: {
    backgroundColor: 'rgba(201,162,39,0.2)', borderWidth: 1, borderColor: colors.primary,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  categoryText: { color: colors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  rightBadges: { flexDirection: 'row', gap: 5 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
  photoCount: {
    position: 'absolute', bottom: 10, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3,
  },
  photoCountText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  favoriteButton: {
    position: 'absolute', top: 10, right: 12,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  content: { padding: 16 },
  title: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: colors.muted, fontSize: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.border },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: colors.primary, fontSize: 22, fontWeight: '900' },
  detailsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(201,162,39,0.1)', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  detailsBtnText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  // Compact
  compactCard: {
    width: 160, height: 130, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border, marginRight: 10,
  },
  compactSelected: { borderColor: colors.primary, borderWidth: 2 },
  compactImage: { width: '100%', height: '100%' },
  compactGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  compactContent: { position: 'absolute', bottom: 8, left: 10, right: 10 },
  compactName: { color: '#fff', fontWeight: '800', fontSize: 12 },
  compactPrice: { color: colors.primary, fontWeight: '900', fontSize: 13 },
  selectedBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 2,
  },
});
