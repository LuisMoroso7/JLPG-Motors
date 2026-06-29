import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function Spec({ icon, label, value }) {
  return (
    <View style={styles.spec}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function DetailsScreen({ route, navigation, vehicles, favorites, toggleFavorite, addToProposal }) {
  const vehicle = vehicles.find((item) => item.id === route.params.vehicleId);

  if (!vehicle) {
    return (
      <Screen style={styles.center}>
        <Ionicons name="alert-circle-outline" size={54} color={colors.muted} />
        <Text style={styles.notFoundTitle}>Veículo não encontrado</Text>
        <PrimaryButton title="Voltar" onPress={() => navigation.goBack()} style={styles.backBtn} />
      </Screen>
    );
  }

  const isFav = favorites.includes(vehicle.id);

  return (
    <Screen noSafe>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Imagem com gradiente */}
        <View style={styles.imageContainer}>
          {vehicle.image ? (
            <Image source={{ uri: vehicle.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.emptyImage]}>
              <Ionicons name="car-outline" size={60} color={colors.muted} />
            </View>
          )}
          <LinearGradient
            colors={['rgba(10,10,15,0.5)', 'transparent', 'rgba(10,10,15,0.9)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favButton} onPress={() => toggleFavorite(vehicle.id)}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? colors.danger : '#fff'} />
          </TouchableOpacity>
          <View style={styles.imageBottom}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{vehicle.category}</Text>
            </View>
            <View style={[styles.stockBadge, vehicle.stock > 0 ? styles.inStock : styles.outStock]}>
              <Ionicons name="checkmark-circle" size={12} color={vehicle.stock > 0 ? colors.success : colors.danger} />
              <Text style={[styles.stockText, { color: vehicle.stock > 0 ? colors.success : colors.danger }]}>
                {vehicle.stock > 0 ? 'Disponível' : 'Indisponível'}
              </Text>
            </View>
          </View>
        </View>

        {/* Info principal */}
        <View style={styles.content}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.price}>{formatCurrency(vehicle.price)}</Text>

          <Text style={styles.description}>{vehicle.description}</Text>

          {/* Grid de specs */}
          <Text style={styles.sectionTitle}>Especificações</Text>
          <View style={styles.specGrid}>
            <Spec icon="calendar-outline" label="Ano" value={vehicle.year} />
            <Spec icon="speedometer-outline" label="Quilometragem" value={`${vehicle.km.toLocaleString('pt-BR')} km`} />
            <Spec icon="git-branch-outline" label="Câmbio" value={vehicle.transmission} />
            <Spec icon="flame-outline" label="Combustível" value={vehicle.fuel} />
            <Spec icon="color-palette-outline" label="Cor" value={vehicle.color} />
            <Spec icon="cube-outline" label="Estoque" value={`${vehicle.stock} unidade${vehicle.stock !== 1 ? 's' : ''}`} />
          </View>

          {/* Ações */}
          <View style={styles.actions}>
            <PrimaryButton
              title="Adicionar à proposta"
              onPress={() => { addToProposal(vehicle); navigation.navigate('Proposta'); }}
              style={styles.actionBtn}
            />
            <PrimaryButton
              title={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              variant="outline"
              onPress={() => toggleFavorite(vehicle.id)}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  imageContainer: { height: 320, position: 'relative' },
  image: { width: '100%', height: '100%' },
  emptyImage: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  backButton: {
    position: 'absolute', top: 52, left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  favButton: {
    position: 'absolute', top: 52, right: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  imageBottom: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(201,162,39,0.2)', borderWidth: 1, borderColor: colors.primary,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  categoryText: { color: colors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  stockBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  inStock: {},
  outStock: {},
  stockText: { fontSize: 12, fontWeight: '700' },
  content: { padding: 20 },
  vehicleName: { color: colors.text, fontSize: 28, fontWeight: '900', marginBottom: 6 },
  price: { color: colors.primary, fontSize: 32, fontWeight: '900', marginBottom: 16 },
  description: { color: colors.textSecondary, lineHeight: 22, fontSize: 14, marginBottom: 24 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  spec: {
    width: '47%', backgroundColor: colors.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: colors.border, gap: 6,
  },
  specLabel: { color: colors.muted, fontSize: 11 },
  specValue: { color: colors.text, fontWeight: '800', fontSize: 14 },
  actions: { gap: 12 },
  actionBtn: {},
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  backBtn: { marginTop: 8, paddingHorizontal: 30 },
});
