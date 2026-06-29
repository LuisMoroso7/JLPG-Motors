import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import FadeInView from '../components/FadeInView';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';
import { apiGetAllNegotiations, apiCloseNegotiation } from '../services/api';

export default function AdminScreen({ navigation, vehicles, deleteVehicle, user, testDrives = [], updateTestDriveStatus, orders = [] }) {
  const [tab, setTab] = useState('vehicles');
  const [search, setSearch] = useState('');
  const [negotiations, setNegotiations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNegotiations();
    // Polling a cada 15 segundos para ver novas negociações
    const interval = setInterval(loadNegotiations, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadNegotiations() {
    try {
      const data = await apiGetAllNegotiations();
      setNegotiations(data);
    } catch (e) {
      // fallback: usa orders locais
      setNegotiations(orders.map((o) => ({
        id: o.id,
        userId: 'local',
        vehicleId: o.items?.[0]?.id,
        vehicleName: o.items?.[0]?.name,
        status: 'OPEN',
        createdAt: o.date,
      })));
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadNegotiations();
    setRefreshing(false);
  }

  async function closeNegotiation(negotiationId, action) {
    Alert.alert(
      action === 'SOLD' ? '✅ Aprovar venda' : '❌ Recusar negociação',
      action === 'SOLD' ? 'Confirmar venda?' : 'Recusar esta negociação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action === 'SOLD' ? 'Aprovar' : 'Recusar',
          style: action === 'SOLD' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await apiCloseNegotiation(negotiationId);
              loadNegotiations();
            } catch (e) {
              setNegotiations((c) => c.map((n) => n.id === negotiationId ? { ...n, status: 'CLOSED' } : n));
            }
          },
        },
      ]
    );
  }

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

  const filtered = vehicles.filter((v) =>
    `${v.name} ${v.brand} ${v.category}`.toLowerCase().includes(search.toLowerCase())
  );
  const pendingDrives = testDrives.filter((t) => t.status === 'confirmed' || t.status === 'pending');
  const openNegotiations = negotiations.filter((n) => n.status === 'OPEN');

  const TABS = [
    { key: 'vehicles', label: 'Veículos', icon: 'car-outline', badge: null },
    { key: 'negotiations', label: 'Negociações', icon: 'chatbubbles-outline', badge: openNegotiations.length },
    { key: 'testdrives', label: 'Test Drives', icon: 'calendar-outline', badge: pendingDrives.length },
  ];

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Painel Admin</Text>
            <Text style={styles.subtitle}>Bem-vindo, {user?.name?.split(' ')[0]}</Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={13} color={colors.primary} />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>

        {/* Stats rápidos */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{vehicles.length}</Text>
            <Text style={styles.statLabel}>Veículos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={[styles.statValue, openNegotiations.length > 0 && { color: colors.primary }]}>{openNegotiations.length}</Text>
            <Text style={styles.statLabel}>Negociações</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={[styles.statValue, pendingDrives.length > 0 && { color: colors.danger }]}>{pendingDrives.length}</Text>
            <Text style={styles.statLabel}>Test Drives</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && { backgroundColor: colors.primary }]}
              onPress={() => setTab(t.key)}
            >
              <Ionicons name={t.icon} size={13} color={tab === t.key ? colors.background : colors.muted} />
              <Text style={[styles.tabText, { color: tab === t.key ? colors.background : colors.muted }]}>{t.label}</Text>
              {t.badge > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: tab === t.key ? colors.background : colors.danger }]}>
                  <Text style={[styles.tabBadgeText, { color: tab === t.key ? colors.primary : '#fff' }]}>{t.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* VEÍCULOS */}
      {tab === 'vehicles' && (
        <>
          <View style={styles.searchArea}>
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={17} color={colors.muted} style={styles.searchIcon} />
              <TextInput value={search} onChangeText={setSearch}
                placeholder="Buscar veículo..." placeholderTextColor={colors.muted}
                style={[styles.searchInput, { color: colors.text }]} />
            </View>
            <PrimaryButton title="+ Novo veículo" onPress={() => navigation.navigate('FormulárioVeículo')} style={styles.newBtn} />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <FadeInView delay={index * 40}>
                <View style={styles.vehicleItem}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.vehicleImage} />
                  ) : (
                    <View style={[styles.vehicleImage, styles.noImage]}>
                      <Ionicons name="car-outline" size={28} color={colors.muted} />
                    </View>
                  )}
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.vehicleMeta}>{item.year} • {item.km?.toLocaleString('pt-BR')} km</Text>
                    <Text style={styles.vehiclePrice}>{formatCurrency(item.price)}</Text>
                    <View style={styles.vehicleActions}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('FormulárioVeículo', { vehicleId: item.id })}>
                        <Ionicons name="pencil-outline" size={14} color={colors.primary} />
                        <Text style={[styles.actionBtnText, { color: colors.primary }]}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                        <Ionicons name="trash-outline" size={14} color={colors.danger} />
                        <Text style={[styles.actionBtnText, { color: colors.danger }]}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </FadeInView>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="car-outline" size={48} color={colors.muted} />
                <Text style={styles.emptyText}>Nenhum veículo cadastrado</Text>
                <PrimaryButton title="Cadastrar primeiro veículo" onPress={() => navigation.navigate('FormulárioVeículo')} style={{ marginTop: 10 }} />
              </View>
            }
          />
        </>
      )}

      {/* NEGOCIAÇÕES */}
      {tab === 'negotiations' && (
        <FlatList
          data={negotiations}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 50}>
              <View style={[styles.negotiationCard, item.status === 'OPEN' && { borderColor: colors.primary }]}>
                <View style={styles.negotiationHeader}>
                  <Ionicons name="chatbubble-outline" size={18} color={item.status === 'OPEN' ? colors.primary : colors.muted} />
                  <Text style={styles.negotiationTitle}>Negociação #{String(item.id).slice(0, 8)}</Text>
                  <View style={[styles.negBadge, { backgroundColor: item.status === 'OPEN' ? 'rgba(201,162,39,0.15)' : 'rgba(122,122,140,0.15)' }]}>
                    <Text style={[styles.negBadgeText, { color: item.status === 'OPEN' ? colors.primary : colors.muted }]}>
                      {item.status === 'OPEN' ? '🟡 Aberta' : '✅ Fechada'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.negotiationMeta}>
                  {item.vehicleName || `Veículo ID: ${String(item.vehicleId).slice(0, 8)}`}
                </Text>
                <Text style={styles.negotiationDate}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '—'}
                </Text>
                {item.status === 'OPEN' && (
                  <View style={styles.negActions}>
                    <TouchableOpacity style={styles.negRefuse} onPress={() => closeNegotiation(item.id, 'NOT_SOLD')}>
                      <Ionicons name="close-circle" size={15} color={colors.danger} />
                      <Text style={[styles.actionBtnText, { color: colors.danger }]}>Recusar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.negApprove} onPress={() => closeNegotiation(item.id, 'SOLD')}>
                      <Ionicons name="checkmark-circle" size={15} color="#fff" />
                      <Text style={[styles.actionBtnText, { color: '#fff' }]}>Aprovar venda</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </FadeInView>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>Nenhuma negociação ainda</Text>
              <Text style={styles.emptySubtext}>Puxe para baixo para atualizar</Text>
            </View>
          }
        />
      )}

      {/* TEST DRIVES */}
      {tab === 'testdrives' && (
        <FlatList
          data={testDrives}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isPending = item.status === 'confirmed' || item.status === 'pending';
            const isApproved = item.status === 'approved';
            return (
              <FadeInView delay={index * 50}>
                <View style={[styles.driveCard, isPending && { borderColor: colors.primary }]}>
                  <View style={styles.driveHeader}>
                    <Text style={styles.driveName}>{item.vehicleName}</Text>
                    <View style={[styles.negBadge, {
                      backgroundColor: isPending ? 'rgba(201,162,39,0.15)' : isApproved ? 'rgba(61,220,132,0.15)' : 'rgba(229,72,77,0.15)',
                    }]}>
                      <Text style={[styles.negBadgeText, {
                        color: isPending ? colors.primary : isApproved ? colors.success : colors.danger,
                      }]}>
                        {isPending ? '⏳ Pendente' : isApproved ? '✅ Confirmado' : '❌ Recusado'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.negotiationMeta}>{item.date} às {item.hour}</Text>
                  <Text style={styles.negotiationDate}>Protocolo: {item.protocol}</Text>
                  {isPending && (
                    <View style={styles.negActions}>
                      <TouchableOpacity style={styles.negRefuse} onPress={() => handleTestDriveAction(item, 'refused')}>
                        <Ionicons name="close-circle" size={15} color={colors.danger} />
                        <Text style={[styles.actionBtnText, { color: colors.danger }]}>Recusar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.negApprove} onPress={() => handleTestDriveAction(item, 'approved')}>
                        <Ionicons name="checkmark-circle" size={15} color="#fff" />
                        <Text style={[styles.actionBtnText, { color: '#fff' }]}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </FadeInView>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>Nenhum test drive agendado</Text>
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8, marginBottom: 14 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 3 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(201,162,39,0.1)' },
  adminBadgeText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14, overflow: 'hidden' },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 22 },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 4, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9, borderRadius: 10 },
  tabText: { fontWeight: '700', fontSize: 11 },
  tabBadge: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { fontSize: 9, fontWeight: '900' },
  searchArea: { paddingHorizontal: 18, paddingBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  searchIcon: { paddingLeft: 14 },
  searchInput: { flex: 1, padding: 13, fontSize: 14 },
  newBtn: {},
  list: { padding: 18, paddingTop: 4, paddingBottom: 30 },
  vehicleItem: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  vehicleImage: { width: 110, height: 140 },
  noImage: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  vehicleInfo: { flex: 1, padding: 12, gap: 4 },
  vehicleName: { color: colors.text, fontWeight: '900', fontSize: 14, lineHeight: 19 },
  vehicleMeta: { color: colors.muted, fontSize: 12 },
  vehiclePrice: { color: colors.primary, fontWeight: '900', fontSize: 16 },
  vehicleActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, paddingVertical: 7 },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: colors.danger, borderRadius: 10, paddingVertical: 7 },
  actionBtnText: { fontWeight: '700', fontSize: 12 },
  negotiationCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1.5, borderColor: colors.border },
  negotiationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  negotiationTitle: { color: colors.text, fontWeight: '900', fontSize: 15, flex: 1 },
  negotiationMeta: { color: colors.textSecondary, fontSize: 14, marginBottom: 4 },
  negotiationDate: { color: colors.muted, fontSize: 12, marginBottom: 10 },
  negBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  negBadgeText: { fontSize: 11, fontWeight: '800' },
  negActions: { flexDirection: 'row', gap: 10 },
  negRefuse: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: colors.danger, borderRadius: 12, paddingVertical: 11 },
  negApprove: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.success, borderRadius: 12, paddingVertical: 11 },
  driveCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1.5, borderColor: colors.border },
  driveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  driveName: { color: colors.text, fontWeight: '900', fontSize: 15, flex: 1 },
  empty: { alignItems: 'center', paddingTop: 50, gap: 10, paddingHorizontal: 30 },
  emptyText: { color: colors.muted, fontWeight: '700', fontSize: 16 },
  emptySubtext: { color: colors.muted, fontSize: 13 },
});
