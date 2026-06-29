import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import VehicleCard from '../components/VehicleCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function FavoritesScreen({ navigation, vehicles, favorites, toggleFavorite }) {
  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>
          {favoriteVehicles.length > 0
            ? `${favoriteVehicles.length} veículo${favoriteVehicles.length > 1 ? 's' : ''} salvo${favoriteVehicles.length > 1 ? 's' : ''}`
            : 'Nenhum veículo salvo ainda'}
        </Text>
      </View>

      <FlatList
        data={favoriteVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            isFavorite
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={48} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
            <Text style={styles.emptyText}>Explore o catálogo e salve os veículos que te interessam.</Text>
            <PrimaryButton
              title="Explorar catálogo"
              onPress={() => navigation.navigate('Catálogo')}
              style={styles.emptyBtn}
            />
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 8 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 5, fontSize: 13 },
  list: { padding: 18, paddingTop: 10, paddingBottom: 30 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 10, paddingHorizontal: 30 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 20 },
  emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 20, fontSize: 13 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 30 },
});
