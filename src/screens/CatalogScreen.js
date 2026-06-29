import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import VehicleCard from '../components/VehicleCard';
import { colors } from '../theme/colors';
import { categories } from '../data/vehicles';

export default function CatalogScreen({ navigation, vehicles, favorites, toggleFavorite }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    let result = vehicles.filter((v) => {
      const matchSearch = !term || `${v.name} ${v.brand} ${v.model} ${v.category}`.toLowerCase().includes(term);
      const matchCategory = activeCategory === 'Todos' || v.category === activeCategory;
      return matchSearch && matchCategory;
    });
    if (sortBy === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'km') result = [...result].sort((a, b) => a.km - b.km);
    if (sortBy === 'year') result = [...result].sort((a, b) => b.year - a.year);
    return result;
  }, [search, activeCategory, sortBy, vehicles]);

  const sorts = [
    { key: 'default', label: 'Relevância' },
    { key: 'price_asc', label: 'Menor preço' },
    { key: 'price_desc', label: 'Maior preço' },
    { key: 'year', label: 'Mais novo' },
    { key: 'km', label: 'Menor KM' },
  ];

  return (
    <Screen>
      {/* Header fixo */}
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo</Text>
        <Text style={styles.subtitle}>{filtered.length} veículos disponíveis</Text>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por modelo, marca..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Ordenação */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortContent}>
          {sorts.map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => setSortBy(s.key)}
              style={[styles.sortChip, sortBy === s.key && styles.sortChipActive]}
            >
              <Text style={[styles.sortChipText, sortBy === s.key && styles.sortChipTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            isFavorite={favorites.includes(item.id)}
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={54} color={colors.muted} />
            <Text style={styles.emptyTitle}>Nenhum veículo encontrado</Text>
            <Text style={styles.emptyText}>Tente outros filtros ou termos de busca</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 10, paddingBottom: 4, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', paddingHorizontal: 18, marginTop: 8 },
  subtitle: { color: colors.muted, paddingHorizontal: 18, marginTop: 4, marginBottom: 14, fontSize: 13 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 18,
    marginBottom: 14,
  },
  searchIcon: { paddingLeft: 14 },
  searchInput: { flex: 1, color: colors.text, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14 },
  clearBtn: { paddingRight: 14 },
  categoriesContent: { paddingHorizontal: 18, gap: 8, marginBottom: 10 },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: colors.card, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { color: colors.muted, fontWeight: '700', fontSize: 13 },
  categoryChipTextActive: { color: colors.background },
  sortContent: { paddingHorizontal: 18, gap: 8, marginBottom: 10, paddingBottom: 2 },
  sortChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'transparent', borderRadius: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  sortChipActive: { borderColor: 'rgba(201,162,39,0.5)', backgroundColor: 'rgba(201,162,39,0.1)' },
  sortChipText: { color: colors.muted, fontWeight: '600', fontSize: 12 },
  sortChipTextActive: { color: colors.primary },
  list: { padding: 18, paddingTop: 10, paddingBottom: 30 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 18 },
  emptyText: { color: colors.muted, fontSize: 13 },
});
