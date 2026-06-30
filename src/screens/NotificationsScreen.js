import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { colors } from '../theme/colors';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'order', title: 'Solicitação em análise', body: 'Nossa equipe recebeu sua proposta e entrará em contato em breve.', time: 'Agora', read: false },
  { id: '2', type: 'price', title: 'Queda de preço!', body: 'BMW 320i M Sport baixou de R$ 195.000 para R$ 189.900.', time: '2h atrás', read: false },
  { id: '3', type: 'new', title: 'Novo veículo disponível', body: 'Mercedes-Benz GLC 300 acabou de entrar no catálogo!', time: '1 dia', read: true },
  { id: '4', type: 'fav', title: 'Favorito disponível', body: 'Toyota Hilux SRX que você favoritou ainda está disponível.', time: '2 dias', read: true },
  { id: '5', type: 'promo', title: 'Condição especial de financiamento', body: 'Taxa a partir de 0,99% a.m. para compras realizadas esta semana.', time: '3 dias', read: true },
];

const ICONS = {
  order: { name: 'receipt-outline', color: colors.primary },
  price: { name: 'trending-down-outline', color: colors.success },
  new: { name: 'car-sport-outline', color: colors.info },
  fav: { name: 'heart-outline', color: colors.danger },
  promo: { name: 'pricetag-outline', color: colors.primary },
};

export default function NotificationsScreen({ orders = [], priceAlerts = [] }) {
  const [readIds, setReadIds] = useState([]);
  const notifications = useMemo(() => {
    const orderNotifications = orders.slice(0, 5).map((order) => ({
      id: `order-${order.id}`,
      type: 'order',
      title: order.status === 'LOCAL' ? 'Solicitação salva localmente' : 'Solicitação enviada',
      body: order.status === 'LOCAL'
        ? 'Seu pedido foi salvo no app e pode ser consultado no histórico.'
        : 'Nossa equipe recebeu sua proposta pelo backend e entrará em contato.',
      time: order.date || 'Agora',
      read: false,
    }));

    const priceNotifications = priceAlerts.slice(0, 5).map((alert) => ({
      id: `price-${alert.id}`,
      type: 'price',
      title: 'Alerta de preço ativo',
      body: `${alert.vehicleName} será monitorado até ${alert.targetPriceFormatted || 'o valor desejado'}.`,
      time: 'Ativo',
      read: false,
    }));

    return [...orderNotifications, ...priceNotifications, ...MOCK_NOTIFICATIONS]
      .map((item) => readIds.includes(item.id) ? { ...item, read: true } : item);
  }, [orders, priceAlerts, readIds]);

  function markAllRead() {
    setReadIds(notifications.map((item) => item.id));
  }

  function markRead(id) {
    setReadIds((current) => current.includes(id) ? current : [...current, id]);
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notificações</Text>
          {unread > 0 && <Text style={styles.subtitle}>{unread} não lidas</Text>}
        </View>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Ionicons name="checkmark-done-outline" size={16} color={colors.primary} />
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const icon = ICONS[item.type] || ICONS.new;
          return (
            <TouchableOpacity
              style={[styles.notif, !item.read && styles.notifUnread]}
              onPress={() => markRead(item.id)}
            >
              <View style={[styles.iconBox, { backgroundColor: `${icon.color}18`, borderColor: `${icon.color}40` }]}>
                <Ionicons name={icon.name} size={20} color={icon.color} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTitleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, paddingBottom: 10 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 3 },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  markAllText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  list: { padding: 18, paddingTop: 8, paddingBottom: 30 },
  notif: { flexDirection: 'row', gap: 14, padding: 14, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  notifUnread: { borderColor: 'rgba(201,162,39,0.3)', backgroundColor: 'rgba(201,162,39,0.04)' },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  notifTitle: { color: colors.text, fontWeight: '800', fontSize: 14, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  notifBody: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 5 },
  notifTime: { color: colors.muted, fontSize: 11 },
  separator: { height: 8 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { color: colors.muted, fontWeight: '700', fontSize: 16 },
});
