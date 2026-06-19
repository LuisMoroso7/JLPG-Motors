import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import VehicleCard from '../components/VehicleCard';
import { colors } from '../theme/colors';

export default function FavoritesScreen({ navigation, vehicles, favorites, toggleFavorite }) {
  const favoriteVehicles = vehicles.filter((vehicle) => favorites.includes(vehicle.id));
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>Veículos salvos para analisar depois.</Text>
      </View>
      <FlatList
        data={favoriteVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            isFavorite
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não salvou nenhum veículo.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 6 },
  list: { padding: 18, paddingBottom: 30 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 30 }
});
