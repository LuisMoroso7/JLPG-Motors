import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function HistoryScreen({ orders }) {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Solicitações de compra realizadas.</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <Text style={styles.orderTitle}>Solicitação #{item.id}</Text>
            <Text style={styles.meta}>{item.date}</Text>
            {item.items.map((vehicle) => (
              <Text key={vehicle.id} style={styles.item}>• {vehicle.name}</Text>
            ))}
            <Text style={styles.total}>{formatCurrency(item.total)}</Text>
            <Text style={styles.status}>Status: aguardando contato da loja</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma solicitação realizada.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 6 },
  list: { padding: 18, paddingBottom: 30 },
  order: { backgroundColor: colors.card, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  orderTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  meta: { color: colors.muted, marginTop: 4, marginBottom: 10 },
  item: { color: colors.text, marginTop: 4 },
  total: { color: colors.primary, fontSize: 20, fontWeight: '900', marginTop: 12 },
  status: { color: colors.success, marginTop: 8, fontWeight: '700' },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 30 }
});
