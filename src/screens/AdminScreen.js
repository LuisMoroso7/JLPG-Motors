import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function AdminScreen({ navigation, vehicles, deleteVehicle, user }) {
  const [search, setSearch] = useState('');

  if (user?.role !== 'ADMIN') {
    return (
      <Screen>
        <View style={styles.blocked}>
          <View style={styles.blockedIcon}>
            <Ionicons name="lock-closed" size={40} color={colors.muted} />
          </View>
          <Text style={styles.blockedTitle}>Acesso restrito</Text>
          <Text style={styles.blockedText}>Faça login com uma conta administradora para acessar esta área.</Text>
        </View>
      </Screen>
    );
  }

  const filtered = vehicles.filter((v) =>
    `${v.name} ${v.brand} ${v.category}`.toLowerCase().includes(search.toLowerCase())
  );

  function confirmDelete(vehicle) {
    Alert.alert(
      'Remover veículo',
      `Deseja remover "${vehicle.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => deleteVehicle(vehicle.id) },
      ]
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Administração</Text>
            <Text style={styles.subtitle}>{vehicles.length} veículos cadastrados</Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={13} color={colors.primary} />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={17} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar veículo..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>

        <PrimaryButton
          title="+ Cadastrar novo veículo"
          onPress={() => navigation.navigate('FormulárioVeículo')}
          style={styles.newBtn}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.noImage]}>
                <Ionicons name="car-outline" size={28} color={colors.muted} />
              </View>
            )}
            <View style={styles.info}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.year} • {item.km.toLocaleString('pt-BR')} km</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('FormulárioVeículo', { vehicleId: item.id })}
                >
                  <Ionicons name="pencil-outline" size={14} color={colors.primary} />
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                  <Ionicons name="trash-outline" size={14} color={colors.danger} />
                  <Text style={styles.deleteBtnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyText}>Nenhum veículo encontrado</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8, marginBottom: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 3 },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: colors.primary,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  adminBadgeText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.input, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  searchIcon: { paddingLeft: 14 },
  searchInput: { flex: 1, color: colors.text, padding: 13, fontSize: 14 },
  newBtn: { marginBottom: 4 },
  list: { padding: 18, paddingTop: 10, paddingBottom: 30 },
  item: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18,
    marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
  },
  image: { width: 110, height: 150 },
  noImage: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: 12, justifyContent: 'center', gap: 3 },
  categoryBadge: {
    backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4,
  },
  categoryText: { color: colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  itemName: { color: colors.text, fontWeight: '900', fontSize: 14, lineHeight: 19 },
  itemMeta: { color: colors.muted, fontSize: 12 },
  itemPrice: { color: colors.primary, fontWeight: '900', fontSize: 16 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingVertical: 7,
  },
  editBtnText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderWidth: 1, borderColor: colors.danger, borderRadius: 10, paddingVertical: 7,
  },
  deleteBtnText: { color: colors.danger, fontWeight: '700', fontSize: 12 },
  blocked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  blockedIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  blockedTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  blockedText: { color: colors.muted, textAlign: 'center', lineHeight: 20, fontSize: 13 },
  emptyContainer: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyText: { color: colors.muted, fontWeight: '700' },
});
