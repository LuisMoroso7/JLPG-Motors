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
  'Sedan': 'car-outline', 'Sedan Premium': 'car-sport-outline',
  'SUV': 'car-outline', 'SUV Premium': 'diamond-outline',
  'Picape': 'construct-outline', 'Hatch Premium': 'flash-outline',
};

export default function HomeScreen({ navigation, vehicles, favorites, toggleFavorite, user, recentlyViewed = [], orders = [], priceAlerts = [], backendMessage, backendOnline = false }) {
  const featuredVehicles = vehicles.filter((v) => v.featured);
  const highlights = (featuredVehicles.length > 0 ? featuredVehicles : vehicles).slice(0, 3);
  const totalVehicles = vehicles.length;
  const avgPrice = totalVehicles > 0 ? vehicles.reduce((s, v) => s + v.price, 0) / totalVehicles : 0;
  const unreadNotifs = orders.filter((order) => order.status === 'CREATED' || order.status === 'LOCAL').length + priceAlerts.length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingHello}>Olá, {user?.name?.split(' ')[0] || 'Cliente'} 👋</Text>
            <Text style={styles.greetingSub}>
              {backendOnline ? (backendMessage || 'Bem-vindo à JLPG Motors') : 'Dados locais carregados'}
            </Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.topBtn} onPress={() => navigation.navigate('Loja')}>
              <Ionicons name="location-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.topBtn, styles.notifBtn]} onPress={() => navigation.navigate('Notificações')}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              {unreadNotifs > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadNotifs}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80' }} style={styles.heroImage} />
          <LinearGradient colors={['transparent', 'rgba(10,10,15,0.6)', 'rgba(10,10,15,0.98)']} style={styles.heroGradient} />
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
            <Text style={styles.statValue} numberOfLines={1}>{formatCurrency(avgPrice)}</Text>
            <Text style={styles.statLabel}>Preço médio</Text>
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.qaCard} onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} />
            <Text style={styles.qaLabel}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaCard} onPress={() => navigation.navigate('Comparar')}>
            <Ionicons name="git-compare-outline" size={24} color={colors.info} />
            <Text style={styles.qaLabel}>Comparar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaCard} onPress={() => navigation.navigate('Loja')}>
            <Ionicons name="location-outline" size={24} color={colors.success} />
            <Text style={styles.qaLabel}>Nossa Loja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaCard} onPress={() => navigation.navigate('Proposta')}>
            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            <Text style={styles.qaLabel}>Proposta</Text>
          </TouchableOpacity>
        </View>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
          {categories.filter((c) => c !== 'Todos').map((cat) => (
            <TouchableOpacity key={cat} style={styles.categoryChip} onPress={() => navigation.navigate('Catálogo')}>
              <Ionicons name={CATEGORY_ICONS[cat] || 'car-outline'} size={18} color={colors.primary} />
              <Text style={styles.categoryChipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vistos recentemente */}
        {recentlyViewed.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🕐 Vistos recentemente</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
              {recentlyViewed.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={styles.recentCard}
                  onPress={() => navigation.navigate('Detalhes', { vehicleId: vehicle.id })}
                >
                  {vehicle.image ? (
                    <Image source={{ uri: vehicle.image }} style={styles.recentImage} />
                  ) : (
                    <View style={[styles.recentImage, styles.recentNoImage]}>
                      <Ionicons name="car-outline" size={22} color={colors.muted} />
                    </View>
                  )}
                  <LinearGradient colors={['transparent', 'rgba(10,10,15,0.9)']} style={styles.recentGradient} />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentName} numberOfLines={1}>{vehicle.name}</Text>
                    <Text style={styles.recentPrice}>{formatCurrency(vehicle.price, vehicle.targetCurrency || 'BRL')}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Destaques */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⭐ Destaques</Text>
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
        <LinearGradient colors={['rgba(201,162,39,0.12)', 'rgba(201,162,39,0.04)']} style={styles.ctaCard}>
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
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  greetingHello: { color: colors.text, fontSize: 20, fontWeight: '900' },
  greetingSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  topActions: { flexDirection: 'row', gap: 8 },
  topBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  notifBtn: { position: 'relative' },
  notifBadge: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: colors.background, fontSize: 9, fontWeight: '900' },
  hero: { height: 340, position: 'relative', marginBottom: 20 },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  heroContent: { position: 'absolute', bottom: 28, left: 20, right: 20 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.4)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 },
  heroBadgeText: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: colors.text, fontSize: 36, fontWeight: '900', lineHeight: 42, marginBottom: 8 },
  heroSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 18 },
  heroBtn: { alignSelf: 'flex-start', paddingHorizontal: 24 },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 14, alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 12, textAlign: 'center' },
  statLabel: { color: colors.muted, fontSize: 11 },
  quickActionsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 22 },
  qaCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 12, alignItems: 'center', gap: 7, borderWidth: 1, borderColor: colors.border },
  qaLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900', paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  categoriesScroll: { marginBottom: 22 },
  categoriesContent: { paddingHorizontal: 20, gap: 10 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border },
  categoryChipText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  recentScroll: { paddingHorizontal: 20, gap: 12, marginBottom: 22 },
  recentCard: { width: 160, height: 110, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  recentImage: { width: '100%', height: '100%' },
  recentNoImage: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  recentGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },
  recentInfo: { position: 'absolute', bottom: 8, left: 10, right: 10 },
  recentName: { color: '#fff', fontWeight: '800', fontSize: 12 },
  recentPrice: { color: colors.primary, fontWeight: '900', fontSize: 13 },
  ctaCard: { marginHorizontal: 20, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)', marginTop: 8 },
  ctaTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 12, marginBottom: 6 },
  ctaText: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: 16, fontSize: 13 },
  ctaBtn: { alignSelf: 'stretch' },
});
