import React, { useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import FadeInView from '../components/FadeInView';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function AdminScreen({ navigation, vehicles, deleteVehicle, user, testDrives = [], updateTestDriveStatus }) {
  const [tab, setTab] = useState('vehicles');
  const [search, setSearch] = useState('');

  if (user?.role !== 'ADMIN') {
    return (
      <Screen style={{ backgroundColor: colors.background }}>
        <View style={styles.blocked}>
          <View style={[styles.blockedIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed" size={40} color={colors.muted} />
          </View>
          <Text style={[styles.blockedTitle, { color: colors.text }]}>Acesso restrito</Text>
          <Text style={[styles.blockedText, { color: colors.muted }]}>Faça login com uma conta administradora.</Text>
        </View>
      </Screen>
    );
  }

  const filtered = vehicles.filter((v) =>
    `${v.name} ${v.brand} ${v.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const pendingDrives = testDrives.filter((t) => t.status === 'confirmed' || t.status === 'pending');
  const allDrives = testDrives;

  function confirmDelete(vehicle) {
    Alert.alert('Remover veículo', `Deseja remover "${vehicle.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => deleteVehicle(vehicle.id) },
    ]);
  }

  function handleTestDriveAction(drive, action) {
    Alert.alert(
      action === 'approved' ? '✅ Confirmar agendamento' : '❌ Recusar agendamento',
      `${drive.vehicleName}\n${drive.date} às ${drive.hour}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action === 'approved' ? 'Confirmar' : 'Recusar',
          style: action === 'approved' ? 'default' : 'destructive',
          onPress: () => updateTestDriveStatus?.(drive.id, action),
        },
      ]
    );
  }

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Administração</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Painel do gerente</Text>
          </View>
          <View style={[styles.adminBadge, { backgroundColor: 'rgba(201,162,39,0.1)', borderColor: colors.primary }]}>
            <Ionicons name="shield-checkmark" size={13} color={colors.primary} />
            <Text style={[styles.adminBadgeText, { color: colors.primary }]}>Admin</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tab, tab === 'vehicles' && { backgroundColor: colors.primary }]}
            onPress={() => setTab('vehicles')}
          >
            <Ionicons name="car-outline" size={14} color={tab === 'vehicles' ? colors.background : colors.muted} />
            <Text style={[styles.tabText, { color: tab === 'vehicles' ? colors.background : colors.muted }]}>
              Veículos ({vehicles.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'testdrives' && { backgroundColor: colors.primary }]}
            onPress={() => setTab('testdrives')}
          >
            <Ionicons name="calendar-outline" size={14} color={tab === 'testdrives' ? colors.background : colors.muted} />
            <Text style={[styles.tabText, { color: tab === 'testdrives' ? colors.background : colors.muted }]}>
              Test Drives {pendingDrives.length > 0 ? `(${pendingDrives.length})` : ''}
            </Text>
            {pendingDrives.length > 0 && (
              <View style={[styles.tabBadge, { backgroundColor: colors.danger }]}>
                <Text style={styles.tabBadgeText}>{pendingDrives.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {tab === 'vehicles' ? (
        <>
          <View style={styles.searchArea}>
            <View style={[styles.searchRow, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={17} color={colors.muted} style={styles.searchIcon} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar veículo..."
                placeholderTextColor={colors.muted}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>
            <PrimaryButton title="+ Novo veículo" onPress={() => navigation.navigate('FormulárioVeículo')} style={styles.newBtn} />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <FadeInView delay={index * 50}>
                <View style={[styles.vehicleItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.vehicleImage} />
                  ) : (
                    <View style={[styles.vehicleImage, styles.noImage, { backgroundColor: colors.surface }]}>
                      <Ionicons name="car-outline" size={28} color={colors.muted} />
                    </View>
                  )}
                  <View style={styles.vehicleInfo}>
                    <View style={[styles.categoryBadge, { backgroundColor: 'rgba(201,162,39,0.1)', borderColor: 'rgba(201,162,39,0.3)' }]}>
                      <Text style={[styles.categoryText, { color: colors.primary }]}>{item.category}</Text>
                    </View>
                    <Text style={[styles.vehicleName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                    <Text style={[styles.vehicleMeta, { color: colors.muted }]}>{item.year} • {item.km?.toLocaleString('pt-BR')} km</Text>
                    <Text style={[styles.vehiclePrice, { color: colors.primary }]}>{formatCurrency(item.price)}</Text>
                    <View style={styles.vehicleActions}>
                      <TouchableOpacity
                        style={[styles.editBtn, { borderColor: colors.primary }]}
                        onPress={() => navigation.navigate('FormulárioVeículo', { vehicleId: item.id })}
                      >
                        <Ionicons name="pencil-outline" size={14} color={colors.primary} />
                        <Text style={[styles.editBtnText, { color: colors.primary }]}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.deleteBtn, { borderColor: colors.danger }]} onPress={() => confirmDelete(item)}>
                        <Ionicons name="trash-outline" size={14} color={colors.danger} />
                        <Text style={[styles.deleteBtnText, { color: colors.danger }]}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </FadeInView>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="car-outline" size={48} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhum veículo encontrado</Text>
              </View>
            }
          />
        </>
      ) : (
        <FlatList
          data={allDrives}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isPending = item.status === 'confirmed' || item.status === 'pending';
            const isApproved = item.status === 'approved';
            const isRefused = item.status === 'refused';

            return (
              <FadeInView delay={index * 60}>
                <View style={[styles.driveCard, { backgroundColor: colors.card, borderColor: isPending ? colors.primary : colors.border }]}>
                  <View style={styles.driveHeader}>
                    <View style={styles.driveIdRow}>
                      <Ionicons name="car-outline" size={18} color={colors.info} />
                      <Text style={[styles.driveName, { color: colors.text }]}>{item.vehicleName}</Text>
                    </View>
                    <View style={[styles.driveBadge, {
                      backgroundColor: isPending ? 'rgba(201,162,39,0.1)' : isApproved ? 'rgba(61,220,132,0.1)' : 'rgba(229,72,77,0.1)',
                      borderColor: isPending ? colors.primary : isApproved ? colors.success : colors.danger,
                    }]}>
                      <Text style={[styles.driveBadgeText, {
                        color: isPending ? colors.primary : isApproved ? colors.success : colors.danger,
                      }]}>
                        {isPending ? '⏳ Pendente' : isApproved ? '✅ Confirmado' : '❌ Recusado'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.driveDetails}>
                    <View style={styles.driveRow}>
                      <Ionicons name="calendar-outline" size={14} color={colors.muted} />
                      <Text style={[styles.driveText, { color: colors.textSecondary }]}>{item.date} às {item.hour}</Text>
                    </View>
                    <View style={styles.driveRow}>
                      <Ionicons name="document-text-outline" size={14} color={colors.muted} />
                      <Text style={[styles.driveText, { color: colors.muted }]}>Protocolo: {item.protocol}</Text>
                    </View>
                  </View>

                  {isPending && (
                    <View style={styles.driveActions}>
                      <TouchableOpacity
                        style={[styles.refuseBtn, { borderColor: colors.danger }]}
                        onPress={() => handleTestDriveAction(item, 'refused')}
                      >
                        <Ionicons name="close-circle" size={15} color={colors.danger} />
                        <Text style={[styles.refuseBtnText, { color: colors.danger }]}>Recusar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.approveBtn, { backgroundColor: colors.success }]}
                        onPress={() => handleTestDriveAction(item, 'approved')}
                      >
                        <Ionicons name="checkmark-circle" size={15} color="#fff" />
                        <Text style={styles.approveBtnText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </FadeInView>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="calendar-outline" size={40} color={colors.muted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum test drive agendado</Text>
              <Text style={[styles.emptySubtext, { color: colors.muted }]}>Os agendamentos dos clientes aparecerão aqui.</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 13, marginTop: 3 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  adminBadgeText: { fontWeight: '800', fontSize: 12 },
  tabs: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 4, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, borderRadius: 10 },
  tabText: { fontWeight: '700', fontSize: 12 },
  tabBadge: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  searchArea: { paddingHorizontal: 18, paddingBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  searchIcon: { paddingLeft: 14 },
  searchInput: { flex: 1, padding: 13, fontSize: 14 },
  newBtn: {},
  list: { padding: 18, paddingTop: 4, paddingBottom: 30 },
  vehicleItem: { flexDirection: 'row', borderRadius: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1 },
  vehicleImage: { width: 110, height: 150 },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  vehicleInfo: { flex: 1, padding: 12, justifyContent: 'center', gap: 3 },
  categoryBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  categoryText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  vehicleName: { fontWeight: '900', fontSize: 14, lineHeight: 19 },
  vehicleMeta: { fontSize: 12 },
  vehiclePrice: { fontWeight: '900', fontSize: 16 },
  vehicleActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingVertical: 7 },
  editBtnText: { fontWeight: '700', fontSize: 12 },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingVertical: 7 },
  deleteBtnText: { fontWeight: '700', fontSize: 12 },
  driveCard: { borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1.5 },
  driveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  driveIdRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  driveName: { fontWeight: '900', fontSize: 15, flex: 1 },
  driveBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  driveBadgeText: { fontSize: 11, fontWeight: '800' },
  driveDetails: { gap: 6, marginBottom: 14 },
  driveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  driveText: { fontSize: 13 },
  driveActions: { flexDirection: 'row', gap: 10 },
  refuseBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingVertical: 11 },
  refuseBtnText: { fontWeight: '800', fontSize: 13 },
  approveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 11 },
  approveBtnText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  blocked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  blockedIcon: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  blockedTitle: { fontSize: 22, fontWeight: '900' },
  blockedText: { textAlign: 'center', lineHeight: 20, fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 50, gap: 10 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontWeight: '900', fontSize: 18 },
  emptySubtext: { fontSize: 13, textAlign: 'center' },
  emptyText: { fontWeight: '700', fontSize: 14 },
});
