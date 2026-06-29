import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

const STATUS_COLORS = {
  pending: colors.primary,
  contact: colors.info,
  done: colors.success,
};

export default function HistoryScreen({ navigation, orders }) {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>
          {orders.length > 0
            ? `${orders.length} solicitação${orders.length > 1 ? 'ões' : ''} realizadas`
            : 'Nenhuma solicitação ainda'}
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <View style={styles.orderHeader}>
              <View style={styles.orderIdRow}>
                <Ionicons name="receipt-outline" size={18} color={colors.primary} />
                <Text style={styles.orderId}>Solicitação #{item.id}</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Aguardando contato</Text>
              </View>
            </View>

            <Text style={styles.orderDate}>
              <Ionicons name="calendar-outline" size={12} color={colors.muted} /> {item.date}
            </Text>

            <View style={styles.itemsList}>
              {item.items.map((vehicle) => (
                <View key={vehicle.id} style={styles.vehicleRow}>
                  <Ionicons name="car-outline" size={14} color={colors.muted} />
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehiclePrice}>{formatCurrency(vehicle.price)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total estimado</Text>
              <Text style={styles.total}>{formatCurrency(item.total)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={48} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>Sem histórico ainda</Text>
            <Text style={styles.emptyText}>Suas solicitações de compra aparecerão aqui.</Text>
            <PrimaryButton
              title="Montar proposta"
              onPress={() => navigation.navigate('Proposta')}
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
  order: {
    backgroundColor: colors.card, padding: 18, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  orderId: { color: colors.text, fontSize: 16, fontWeight: '900' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(201,162,39,0.1)', borderRadius: 8,
    paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  statusText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  orderDate: { color: colors.muted, fontSize: 12, marginBottom: 14 },
  itemsList: { gap: 8, marginBottom: 14, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vehicleName: { flex: 1, color: colors.textSecondary, fontSize: 14 },
  vehiclePrice: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  orderFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12,
  },
  totalLabel: { color: colors.muted, fontSize: 13 },
  total: { color: colors.primary, fontSize: 20, fontWeight: '900' },
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
