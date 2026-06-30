import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import FadeInView from '../components/FadeInView';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function getOrderStatus(order) {
  if (order.status === 'LOCAL') return { label: 'Salvo localmente', color: colors.info };
  if (order.status === 'CREATED') return { label: 'Aguardando', color: colors.primary };
  if (order.status === 'CLOSED') return { label: 'Finalizado', color: colors.success };
  return { label: order.status || 'Aguardando', color: colors.primary };
}

export default function HistoryScreen({ navigation, orders = [], testDrives = [] }) {
  const [tab, setTab] = useState('orders');

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Histórico</Text>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tab, tab === 'orders' && { backgroundColor: colors.primary }]}
            onPress={() => setTab('orders')}
          >
            <Text style={[styles.tabText, { color: tab === 'orders' ? colors.background : colors.muted }]}>
              Pedidos ({orders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'testdrives' && { backgroundColor: colors.primary }]}
            onPress={() => setTab('testdrives')}
          >
            <Text style={[styles.tabText, { color: tab === 'testdrives' ? colors.background : colors.muted }]}>
              Test Drives ({testDrives.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === 'orders' ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 60}>
              <View style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {(() => {
                  const status = getOrderStatus(item);
                  return (
                    <>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdRow}>
                    <Ionicons name="receipt-outline" size={18} color={colors.primary} />
                    <Text style={[styles.orderId, { color: colors.text }]}>Pedido #{item.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${status.color}18`, borderColor: `${status.color}40` }]}>
                    <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
                    </>
                  );
                })()}
                <Text style={[styles.orderDate, { color: colors.muted }]}>📅 {item.date}</Text>
                <View style={[styles.itemsList, { borderTopColor: colors.border }]}>
                  {item.items.map((vehicle) => (
                    <View key={vehicle.id} style={styles.vehicleRow}>
                      <Ionicons name="car-outline" size={14} color={colors.muted} />
                      <Text style={[styles.vehicleName, { color: colors.textSecondary }]}>{vehicle.name}</Text>
                      <Text style={[styles.vehiclePrice, { color: colors.muted }]}>{formatCurrency(vehicle.price, vehicle.currency || item.currency)}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
                  <Text style={[styles.totalLabel, { color: colors.muted }]}>Total estimado</Text>
                  <Text style={[styles.total, { color: colors.primary }]}>{formatCurrency(item.total, item.currency)}</Text>
                </View>
              </View>
            </FadeInView>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="receipt-outline" size={40} color={colors.muted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Sem pedidos ainda</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>Suas solicitações de compra aparecerão aqui.</Text>
              <PrimaryButton title="Ver catálogo" onPress={() => navigation.navigate('Catálogo')} style={styles.emptyBtn} />
            </View>
          }
        />
      ) : (
        <FlatList
          data={testDrives}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <FadeInView delay={index * 60}>
              <View style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIdRow}>
                    <Ionicons name="car-outline" size={18} color={colors.info} />
                    <Text style={[styles.orderId, { color: colors.text }]}>Test Drive</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15`, borderColor: `${colors.success}40` }]}>
                    <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.statusText, { color: colors.success }]}>Confirmado</Text>
                  </View>
                </View>
                <View style={styles.tdInfo}>
                  <View style={styles.tdRow}>
                    <Ionicons name="car-sport-outline" size={15} color={colors.muted} />
                    <Text style={[styles.tdText, { color: colors.text }]}>{item.vehicleName}</Text>
                  </View>
                  <View style={styles.tdRow}>
                    <Ionicons name="calendar-outline" size={15} color={colors.muted} />
                    <Text style={[styles.tdText, { color: colors.muted }]}>{item.date} às {item.hour}</Text>
                  </View>
                  <View style={styles.tdRow}>
                    <Ionicons name="location-outline" size={15} color={colors.muted} />
                    <Text style={[styles.tdText, { color: colors.muted }]}>JLPG Motors — Ciriaco, RS</Text>
                  </View>
                </View>
                <View style={[styles.protocolBadge, { backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}30` }]}>
                  <Text style={[styles.protocolText, { color: colors.primary }]}>Protocolo: {item.protocol}</Text>
                </View>
              </View>
            </FadeInView>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="car-outline" size={40} color={colors.muted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Sem test drives agendados</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>Agende um test drive pelo catálogo.</Text>
              <PrimaryButton title="Ver catálogo" onPress={() => navigation.navigate('Catálogo')} style={styles.emptyBtn} />
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '900', marginTop: 10, marginBottom: 14 },
  tabs: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabText: { fontWeight: '700', fontSize: 13 },
  list: { padding: 18, paddingTop: 8, paddingBottom: 30 },
  orderCard: { borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  orderId: { fontSize: 16, fontWeight: '900' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  orderDate: { fontSize: 12, marginBottom: 14 },
  itemsList: { gap: 8, marginBottom: 14, borderTopWidth: 1, paddingTop: 12 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vehicleName: { flex: 1, fontSize: 14 },
  vehiclePrice: { fontSize: 13, fontWeight: '700' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 12 },
  totalLabel: { fontSize: 13 },
  total: { fontSize: 20, fontWeight: '900' },
  tdInfo: { gap: 8, marginBottom: 12 },
  tdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tdText: { fontSize: 14 },
  protocolBadge: { borderRadius: 10, padding: 10, borderWidth: 1, alignItems: 'center' },
  protocolText: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 50, gap: 10, paddingHorizontal: 30 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { fontWeight: '900', fontSize: 20 },
  emptyText: { textAlign: 'center', lineHeight: 20, fontSize: 13 },
  emptyBtn: { marginTop: 8 },
});
