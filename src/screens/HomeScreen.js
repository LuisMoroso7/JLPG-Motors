import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import VehicleCard from '../components/VehicleCard';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';
import { categories } from '../data/vehicles';

const CATEGORY_ICONS = {
  'Todos': 'apps-outline',
  'Sedan': 'car-outline',
  'Sedan Premium': 'car-sport-outline',
  'SUV': 'car-outline',
  'SUV Premium': 'diamond-outline',
  'Picape': 'construct-outline',
  'Hatch Premium': 'flash-outline',
};

export default function HomeScreen({ navigation, vehicles, favorites, toggleFavorite, user }) {
  const highlights = vehicles.slice(0, 3);
  const totalVehicles = vehicles.length;
  const avgPrice = vehicles.reduce((s, v) => s + v.price, 0) / totalVehicles;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80' }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,15,0.6)', 'rgba(10,10,15,0.98)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="star" size={11} color={colors.primary} />
              <Text style={styles.heroBadgeText}>CATÁLOGO PREMIUM</Text>
            </View>
            <Text style={styles.heroTitle}>Encontre o{'\n'}carro ideal</Text>
            <Text style={styles.heroSubtitle}>Veículos selecionados com atendimento personalizado.</Text>
            <PrimaryButton title="Explorar catálogo" onPress={() => navigation.navigate('Catálogo')} style={styles.heroBtn} />
          </View>
        </View>

        {/* Saudação */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingHello}>Olá, {user?.name?.split(' ')[0] || 'Cliente'} 👋</Text>
            <Text style={styles.greetingSub}>Bem-vindo à JLPG Motors</Text>
          </View>
          {user?.role === 'ADMIN' && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={13} color={colors.primary} />
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="car-sport" size={22} color={colors.primary} />
            <Text style={styles.statValue}>{totalVehicles}</Text>
            <Text style={styles.statLabel}>Veículos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={22} color={colors.danger} />
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={22} color={colors.success} />
            <Text style={styles.statValue}>{formatCurrency(avgPrice).replace('R$\u00a0', 'R$ ')}</Text>
            <Text style={styles.statLabel}>Preço médio</Text>
          </View>
        </View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
          {categories.filter(c => c !== 'Todos').map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryChip}
              onPress={() => navigation.navigate('Catálogo')}
            >
              <Ionicons name={CATEGORY_ICONS[cat] || 'car-outline'} size={18} color={colors.primary} />
              <Text style={styles.categoryChipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Destaques */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catálogo')} style={styles.seeAll}>
            <Text style={styles.seeAllText}>Ver todos</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {highlights.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isFavorite={favorites.includes(vehicle.id)}
            onFavorite={() => toggleFavorite(vehicle.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: vehicle.id })}
          />
        ))}

        {/* CTA */}
        <LinearGradient
          colors={['rgba(201,162,39,0.12)', 'rgba(201,162,39,0.04)']}
          style={styles.ctaCard}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={32} color={colors.primary} />
          <Text style={styles.ctaTitle}>Pronto para negociar?</Text>
          <Text style={styles.ctaText}>Monte sua proposta e nossa equipe entrará em contato.</Text>
          <PrimaryButton title="Montar proposta" onPress={() => navigation.navigate('Catálogo')} style={styles.ctaBtn} />
        </LinearGradient>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  hero: { height: 400, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  heroContent: { position: 'absolute', bottom: 28, left: 20, right: 20 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10,
  },
  heroBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: colors.text, fontSize: 36, fontWeight: '900', lineHeight: 42, marginBottom: 8 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 18 },
  heroBtn: { alignSelf: 'flex-start', paddingHorizontal: 24 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 6 },
  greetingHello: { color: colors.text, fontSize: 20, fontWeight: '900' },
  greetingSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(201,162,39,0.12)', borderWidth: 1, borderColor: colors.primary,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  adminBadgeText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 14, marginBottom: 22 },
  statCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.border,
  },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 13, textAlign: 'center' },
  statLabel: { color: colors.muted, fontSize: 11 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900', paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  categoriesScroll: { marginBottom: 24 },
  categoriesContent: { paddingHorizontal: 20, gap: 10 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  categoryChipText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  ctaCard: {
    marginHorizontal: 20, borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)', marginTop: 8,
  },
  ctaTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 12, marginBottom: 6 },
  ctaText: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 16, fontSize: 13 },
  ctaBtn: { alignSelf: 'stretch' },
});
