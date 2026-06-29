import React from 'react';
import { Alert, FlatList, Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import FadeInView from '../components/FadeInView';
import { darkColors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProposalScreen({ navigation, proposal, removeFromProposal, finishOrder, user, colors: themeColors }) {
  const colors = themeColors || darkColors;
  const total = proposal.reduce((sum, item) => sum + item.price, 0);

  function handleFinish() {
    if (proposal.length === 0) { Alert.alert('Proposta vazia', 'Adicione pelo menos um veículo à proposta.'); return; }
    Alert.alert(
      'Confirmar solicitação',
      `Deseja confirmar a proposta de ${formatCurrency(total)}?`,
      [{ text: 'Cancelar', style: 'cancel' }, { text: 'Confirmar', onPress: finishOrder }]
    );
  }

  async function handleShareProposal() {
    if (proposal.length === 0) { Alert.alert('Proposta vazia', 'Adicione veículos antes de compartilhar.'); return; }
    const date = new Date().toLocaleDateString('pt-BR');
    const itemsList = proposal.map((v, i) => `${i + 1}. ${v.name} (${v.year}) — ${formatCurrency(v.price)}`).join('\n');
    const message = `🚗 *Proposta JLPG Motors*\nCliente: ${user?.name || 'Cliente'}\nData: ${date}\n\n${itemsList}\n\n💰 *Total estimado: ${formatCurrency(total)}*\n\nNossa equipe entrará em contato para negociação.\nJLPG Motors — Passo Fundo, RS`;
    try {
      await Share.share({ message, title: 'Proposta JLPG Motors' });
    } catch (e) {}
  }

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Proposta</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {proposal.length > 0 ? `${proposal.length} veículo${proposal.length > 1 ? 's' : ''} selecionado${proposal.length > 1 ? 's' : ''}` : 'Nenhum veículo selecionado'}
            </Text>
          </View>
          {proposal.length > 0 && (
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleShareProposal}
              accessibilityLabel="Compartilhar proposta"
              accessibilityRole="button"
            >
              <Ionicons name="share-outline" size={18} color={colors.primary} />
              <Text style={[styles.shareBtnText, { color: colors.primary }]}>Compartilhar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={proposal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: proposal.length > 0 ? 200 : 30 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInView delay={index * 80}>
            <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.noImage, { backgroundColor: colors.surface }]}>
                  <Ionicons name="car-outline" size={28} color={colors.muted} />
                </View>
              )}
              <View style={styles.info}>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.itemMeta, { color: colors.muted }]}>{item.year} • {item.transmission}</Text>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>{formatCurrency(item.price)}</Text>
                <TouchableOpacity onPress={() => removeFromProposal(item.id)} style={styles.removeBtn} accessibilityLabel={`Remover ${item.name} da proposta`}>
                  <Ionicons name="trash-outline" size={14} color={colors.danger} />
                  <Text style={[styles.removeText, { color: colors.danger }]}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          </FadeInView>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="document-text-outline" size={48} color={colors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Proposta vazia</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>Adicione veículos do catálogo para montar sua proposta.</Text>
            <PrimaryButton title="Ver catálogo" onPress={() => navigation.navigate('Catálogo')} style={styles.emptyBtn} />
          </View>
        }
      />

      {proposal.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.footerRow}>
            <Text style={[styles.totalLabel, { color: colors.muted }]}>Valor estimado total</Text>
            <Text style={[styles.total, { color: colors.primary }]}>{formatCurrency(total)}</Text>
          </View>
          <Text style={[styles.footerNote, { color: colors.muted }]}>
            Nossa equipe entrará em contato para negociação.
          </Text>
          <View style={styles.footerActions}>
            <TouchableOpacity style={[styles.footerShareBtn, { borderColor: colors.primary }]} onPress={handleShareProposal}>
              <Ionicons name="share-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
            <PrimaryButton title="Gerar solicitação de compra" onPress={handleFinish} style={styles.finishBtn} />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 10 },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { marginTop: 5, fontSize: 13 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  shareBtnText: { fontWeight: '700', fontSize: 13 },
  list: { padding: 18, paddingTop: 10 },
  item: { flexDirection: 'row', borderRadius: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1 },
  image: { width: 120, height: 130 },
  noImage: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, padding: 14, justifyContent: 'center', gap: 3 },
  itemName: { fontWeight: '900', fontSize: 15 },
  itemMeta: { fontSize: 12 },
  itemPrice: { fontWeight: '900', fontSize: 17, marginTop: 2 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  removeText: { fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 10, paddingHorizontal: 30 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emptyTitle: { fontWeight: '900', fontSize: 20 },
  emptyText: { textAlign: 'center', lineHeight: 20, fontSize: 13 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 30 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  totalLabel: { fontSize: 13 },
  total: { fontSize: 22, fontWeight: '900' },
  footerNote: { fontSize: 11, marginBottom: 14 },
  footerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  footerShareBtn: { width: 48, height: 48, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  finishBtn: { flex: 1 },
});
