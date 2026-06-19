import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import VehicleCard from '../components/VehicleCard';
import { colors } from '../theme/colors';

export default function CatalogScreen({ navigation, vehicles, favorites, toggleFavorite }) {
  const [search, setSearch] = useState('');

  const filteredVehicles = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return vehicles;
    return vehicles.filter((vehicle) =>
      `${vehicle.name} ${vehicle.brand} ${vehicle.model} ${vehicle.category}`.toLowerCase().includes(term)
    );
  }, [search, vehicles]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de veículos</Text>
        <Text style={styles.subtitle}>Escolha um veículo e consulte os detalhes.</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por modelo, marca ou categoria"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            isFavorite={favorites.includes(item.id)}
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum veículo encontrado.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 10 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 6, marginBottom: 16 },
  input: { backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, color: colors.text, borderRadius: 14, padding: 14 },
  list: { padding: 18, paddingTop: 8, paddingBottom: 30 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 30 }
});
