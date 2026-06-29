import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated, FlatList, Modal, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import VehicleCard from '../components/VehicleCard';
import SkeletonCard from '../components/SkeletonCard';
import FadeInView from '../components/FadeInView';
import { darkColors } from '../theme/colors';
import { categories, brands } from '../data/vehicles';

const FUELS = ['Todos', 'Gasolina', 'Flex', 'Diesel'];
const TRANSMISSIONS = ['Todos', 'Automático', 'Manual', 'CVT', 'DSG'];
const MAX_HISTORY = 5;

export default function CatalogScreen({ navigation, vehicles, favorites, toggleFavorite, colors: themeColors }) {
  const colors = themeColors || darkColors;
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['BMW', 'SUV 2022', 'Toyota automático']);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('list');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeBrand, setActiveBrand] = useState('Todas');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', maxKm: '', fuel: 'Todos', transmission: 'Todos' });
  const [tempFilters, setTempFilters] = useState(filters);

  const activeFiltersCount = [filters.minPrice, filters.maxPrice, filters.maxKm,
    filters.fuel !== 'Todos' ? filters.fuel : null, filters.transmission !== 'Todos' ? filters.transmission : null,
  ].filter(Boolean).length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => { setRefreshing(false); setLoading(false); }, 1200);
  }, []);

  function handleSearch(text) {
    setSearch(text);
  }

  function applySearch(text) {
    if (text.trim() && !searchHistory.includes(text.trim())) {
      setSearchHistory((h) => [text.trim(), ...h].slice(0, MAX_HISTORY));
    }
    setSearchFocused(false);
  }

  function clearHistory() {
    setSearchHistory([]);
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    let result = vehicles.filter((v) => {
      const matchSearch = !term || `${v.name} ${v.brand} ${v.model} ${v.category} ${v.fuel} ${v.transmission}`.toLowerCase().includes(term);
      const matchCategory = activeCategory === 'Todos' || v.category === activeCategory;
      const matchBrand = activeBrand === 'Todas' || v.brand === activeBrand;
      const matchMin = !filters.minPrice || v.price >= Number(filters.minPrice);
      const matchMax = !filters.maxPrice || v.price <= Number(filters.maxPrice);
      const matchKm = !filters.maxKm || v.km <= Number(filters.maxKm);
      const matchFuel = filters.fuel === 'Todos' || v.fuel === filters.fuel;
      const matchTrans = filters.transmission === 'Todos' || v.transmission.includes(filters.transmission);
      return matchSearch && matchCategory && matchBrand && matchMin && matchMax && matchKm && matchFuel && matchTrans;
    });
    if (sortBy === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'km') result = [...result].sort((a, b) => a.km - b.km);
    if (sortBy === 'year') result = [...result].sort((a, b) => b.year - a.year);
    return result;
  }, [search, activeCategory, activeBrand, sortBy, filters, vehicles]);

  const sorts = [
    { key: 'default', label: 'Relevância' },
    { key: 'price_asc', label: 'Menor preço' },
    { key: 'price_desc', label: 'Maior preço' },
    { key: 'year', label: 'Mais novo' },
    { key: 'km', label: 'Menor KM' },
  ];

  function applyFilters() { setFilters(tempFilters); setShowFilters(false); }
  function clearFilters() {
    const clean = { minPrice: '', maxPrice: '', maxKm: '', fuel: 'Todos', transmission: 'Todos' };
    setFilters(clean); setTempFilters(clean); setShowFilters(false);
  }

  const renderItem = ({ item, index }) => (
    <FadeInView delay={index * 60}>
      {viewMode === 'grid' ? (
        <View style={styles.gridItem}>
          <VehicleCard compact vehicle={item} isFavorite={favorites.includes(item.id)}
            onFavorite={() => toggleFavorite(item.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: item.id })} />
        </View>
      ) : (
        <VehicleCard vehicle={item} isFavorite={favorites.includes(item.id)}
          onFavorite={() => toggleFavorite(item.id)}
          onPress={() => navigation.navigate('Detalhes', { vehicleId: item.id })} />
      )}
    </FadeInView>
  );

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Catálogo</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>{filtered.length} veículos</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: activeFiltersCount > 0 ? colors.primary : colors.border }, activeFiltersCount > 0 && { backgroundColor: colors.primary }]}
              onPress={() => { setTempFilters(filters); setShowFilters(true); }}
              accessibilityLabel="Filtros avançados"
              accessibilityRole="button"
            >
              <Ionicons name="options-outline" size={18} color={activeFiltersCount > 0 ? colors.background : colors.text} />
              {activeFiltersCount > 0 && <Text style={[styles.filterBtnBadge, { color: colors.background }]}>{activeFiltersCount}</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              accessibilityLabel={viewMode === 'list' ? 'Alternar para grade' : 'Alternar para lista'}
              accessibilityRole="button"
            >
              <Ionicons name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchRow, { backgroundColor: colors.input, borderColor: searchFocused ? colors.primary : colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            onSubmitEditing={() => applySearch(search)}
            placeholder="Buscar por modelo, marca, combustível..."
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.text }]}
            returnKeyType="search"
            accessibilityLabel="Campo de busca de veículos"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setSearchFocused(false); }} style={styles.clearBtn} accessibilityLabel="Limpar busca">
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Histórico de buscas */}
        {searchFocused && searchHistory.length > 0 && (
          <View style={[styles.historyDropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyTitle, { color: colors.muted }]}>Buscas recentes</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={[styles.clearHistoryText, { color: colors.danger }]}>Limpar</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.map((term) => (
              <TouchableOpacity
                key={term}
                style={[styles.historyItem, { borderBottomColor: colors.border }]}
                onPress={() => { setSearch(term); applySearch(term); }}
              >
                <Ionicons name="time-outline" size={15} color={colors.muted} />
                <Text style={[styles.historyItemText, { color: colors.textSecondary }]}>{term}</Text>
                <Ionicons name="arrow-up-outline" size={14} color={colors.muted} style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryChip,
                { backgroundColor: activeCategory === cat ? colors.primary : colors.card, borderColor: activeCategory === cat ? colors.primary : colors.border }
              ]}
              accessibilityLabel={`Filtrar por ${cat}`}
              accessibilityRole="button"
              accessibilityState={{ selected: activeCategory === cat }}
            >
              <Text style={[styles.categoryChipText, { color: activeCategory === cat ? colors.background : colors.muted }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


        {/* Marcas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand}
              onPress={() => setActiveBrand(brand)}
              style={[styles.brandChip,
                { backgroundColor: activeBrand === brand ? `${colors.primary}20` : 'transparent',
                  borderColor: activeBrand === brand ? colors.primary : colors.border }
              ]}
            >
              <Text style={[styles.brandChipText, { color: activeBrand === brand ? colors.primary : colors.muted }]}>
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Ordenação */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortContent}>
          {sorts.map((s) => (
            <TouchableOpacity key={s.key} onPress={() => setSortBy(s.key)}
              style={[styles.sortChip, { borderColor: sortBy === s.key ? 'rgba(201,162,39,0.5)' : colors.border, backgroundColor: sortBy === s.key ? 'rgba(201,162,39,0.1)' : 'transparent' }]}
            >
              <Text style={[styles.sortChipText, { color: sortBy === s.key ? colors.primary : colors.muted }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista com skeleton */}
      {loading ? (
        <ScrollView contentContainerStyle={styles.list}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} colors={colors} />)}
        </ScrollView>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={[styles.list, viewMode === 'grid' && styles.gridList]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={54} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum veículo encontrado</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>Tente outros filtros ou termos de busca</Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={clearFilters} style={[styles.clearFiltersBtn, { borderColor: colors.primary }]}>
                  <Text style={[styles.clearFiltersText, { color: colors.primary }]}>Limpar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}

      {/* Modal de filtros */}
      <Modal visible={showFilters} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros avançados</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)} accessibilityLabel="Fechar filtros">
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.filterLabel, { color: colors.muted }]}>Faixa de preço</Text>
              <View style={styles.rangeRow}>
                <TextInput value={tempFilters.minPrice} onChangeText={(v) => setTempFilters((f) => ({ ...f, minPrice: v }))}
                  placeholder="Mín. R$" placeholderTextColor={colors.muted} keyboardType="numeric"
                  style={[styles.rangeInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} />
                <Text style={[styles.rangeSep, { color: colors.muted }]}>—</Text>
                <TextInput value={tempFilters.maxPrice} onChangeText={(v) => setTempFilters((f) => ({ ...f, maxPrice: v }))}
                  placeholder="Máx. R$" placeholderTextColor={colors.muted} keyboardType="numeric"
                  style={[styles.rangeInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} />
              </View>
              <Text style={[styles.filterLabel, { color: colors.muted }]}>Km máximo</Text>
              <TextInput value={tempFilters.maxKm} onChangeText={(v) => setTempFilters((f) => ({ ...f, maxKm: v }))}
                placeholder="Ex: 50000" placeholderTextColor={colors.muted} keyboardType="numeric"
                style={[styles.filterInput, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} />
              <Text style={[styles.filterLabel, { color: colors.muted }]}>Combustível</Text>
              <View style={styles.chipGroup}>
                {FUELS.map((f) => (
                  <TouchableOpacity key={f} onPress={() => setTempFilters((fi) => ({ ...fi, fuel: f }))}
                    style={[styles.filterChip, { backgroundColor: tempFilters.fuel === f ? colors.primary : colors.card, borderColor: tempFilters.fuel === f ? colors.primary : colors.border }]}>
                    <Text style={[styles.filterChipText, { color: tempFilters.fuel === f ? colors.background : colors.muted }]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.filterLabel, { color: colors.muted }]}>Câmbio</Text>
              <View style={styles.chipGroup}>
                {TRANSMISSIONS.map((t) => (
                  <TouchableOpacity key={t} onPress={() => setTempFilters((fi) => ({ ...fi, transmission: t }))}
                    style={[styles.filterChip, { backgroundColor: tempFilters.transmission === t ? colors.primary : colors.card, borderColor: tempFilters.transmission === t ? colors.primary : colors.border }]}>
                    <Text style={[styles.filterChipText, { color: tempFilters.transmission === t ? colors.background : colors.muted }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.clearFiltersModalBtn, { borderColor: colors.border }]} onPress={clearFilters}>
                <Text style={[styles.clearFiltersModalText, { color: colors.muted }]}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.applyBtn, { backgroundColor: colors.primary }]} onPress={applyFilters}>
                <Text style={[styles.applyBtnText, { color: colors.background }]}>Aplicar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 10, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 18, marginTop: 8, marginBottom: 14 },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { marginTop: 3, fontSize: 13 },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  filterBtnBadge: { fontWeight: '900', fontSize: 12 },
  viewModeBtn: { borderRadius: 12, padding: 8, borderWidth: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, marginHorizontal: 18, marginBottom: 6 },
  searchIcon: { paddingLeft: 14 },
  searchInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14 },
  clearBtn: { paddingRight: 14 },
  historyDropdown: { marginHorizontal: 18, borderRadius: 16, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  historyTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  clearHistoryText: { fontSize: 12, fontWeight: '700' },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  historyItemText: { flex: 1, fontSize: 14 },
  categoriesContent: { paddingHorizontal: 18, gap: 8, marginBottom: 10, marginTop: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  categoryChipText: { fontWeight: '700', fontSize: 13 },
  sortContent: { paddingHorizontal: 18, gap: 8, marginBottom: 10, paddingBottom: 2 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  brandChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  brandChipText: { fontWeight: '700', fontSize: 12 },
  sortChipText: { fontWeight: '600', fontSize: 12 },
  list: { padding: 18, paddingTop: 10, paddingBottom: 30 },
  gridList: { paddingHorizontal: 12 },
  gridItem: { flex: 1, padding: 4 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontWeight: '900', fontSize: 18 },
  emptyText: { fontSize: 13 },
  clearFiltersBtn: { marginTop: 6, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  clearFiltersText: { fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: '80%', borderTopWidth: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  filterLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 16 },
  rangeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rangeInput: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 14 },
  rangeSep: {},
  filterInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 14 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  filterChipText: { fontWeight: '700', fontSize: 13 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  clearFiltersModalBtn: { flex: 1, padding: 15, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  clearFiltersModalText: { fontWeight: '700' },
  applyBtn: { flex: 2, padding: 15, borderRadius: 14, alignItems: 'center' },
  applyBtnText: { fontWeight: '900', fontSize: 15 },
});
