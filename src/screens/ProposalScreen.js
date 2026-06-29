import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProposalScreen({ navigation, proposal, removeFromProposal, finishOrder }) {
  const total = proposal.reduce((sum, item) => sum + item.price, 0);

  function handleFinish() {
    if (proposal.length === 0) {
      Alert.alert('Proposta vazia', 'Adicione pelo menos um veículo à proposta.');
      return;
    }
    Alert.alert(
      'Confirmar solicitação',
      `Deseja confirmar a proposta de ${formatCurrency(total)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: finishOrder },
      ]
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Proposta</Text>
        <Text style={styles.subtitle}>
          {proposal.length > 0
            ? `${proposal.length} veículo${proposal.length > 1 ? 's' : ''} selecionado${proposal.length > 1 ? 's' : ''}`
            : 'Nenhum veículo selecionado'}
        </Text>
      </View>

      <FlatList
        data={proposal}
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
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.year} • {item.transmission}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              <TouchableOpacity onPress={() => removeFromProposal(item.id)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={14} color={colors.danger} />
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="document-text-outline" size={48} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>Proposta vazia</Text>
            <Text style={styles.emptyText}>Adicione veículos do catálogo para montar sua proposta.</Text>
            <PrimaryButton
              title="Ver catálogo"
              onPress={() => navigation.navigate('Catálogo')}
              style={styles.emptyBtn}
            />
          </View>
        }
      />

      {proposal.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.totalLabel}>Valor estimado total</Text>
            <Text style={styles.total}>{formatCurrency(total)}</Text>
          </View>
          <Text style={styles.footerNote}>
            <Ionicons name="information-circle-outline" size={12} color={colors.muted} /> Nossa equipe entrará em contato para negociação.
          </Text>
          <PrimaryButton title="Gerar solicitação de compra" onPress={handleFinish} style={styles.finishBtn} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 8 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 5, fontSize: 13 },
  list: { padding: 18, paddingTop: 10, paddingBottom: 200 },
  item: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, marginBottom: 14,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
  },
  image: { width: 120, height: 130 },
  noImage: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: 14, justifyContent: 'center', gap: 3 },
  itemName: { color: colors.text, fontWeight: '900', fontSize: 15 },
  itemMeta: { color: colors.muted, fontSize: 12 },
  itemPrice: { color: colors.primary, fontWeight: '900', fontSize: 17, marginTop: 2 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  removeText: { color: colors.danger, fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 10, paddingHorizontal: 30 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 20 },
  emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 20, fontSize: 13 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 30 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, padding: 20,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  totalLabel: { color: colors.muted, fontSize: 13 },
  total: { color: colors.primary, fontSize: 22, fontWeight: '900' },
  footerNote: { color: colors.muted, fontSize: 11, marginBottom: 14 },
  finishBtn: {},
});
