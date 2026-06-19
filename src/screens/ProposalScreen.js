import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProposalScreen({ proposal, removeFromProposal, finishOrder }) {
  const total = proposal.reduce((sum, item) => sum + item.price, 0);

  function handleFinish() {
    if (proposal.length === 0) {
      Alert.alert('Proposta vazia', 'Adicione pelo menos um veículo à proposta.');
      return;
    }
    finishOrder();
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Proposta</Text>
        <Text style={styles.subtitle}>Veículos selecionados para negociação.</Text>
      </View>
      <FlatList
        data={proposal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <PrimaryButton title="Remover" variant="outline" onPress={() => removeFromProposal(item.id)} style={styles.remove} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum veículo adicionado à proposta.</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Valor estimado</Text>
        <Text style={styles.total}>{formatCurrency(total)}</Text>
        <PrimaryButton title="Gerar solicitação de compra" onPress={handleFinish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 6 },
  list: { padding: 18, paddingBottom: 160 },
  item: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  image: { width: 120, height: 130 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  name: { color: colors.text, fontWeight: '900', fontSize: 16 },
  price: { color: colors.primary, fontWeight: '900', marginTop: 6, fontSize: 17 },
  remove: { marginTop: 12, paddingVertical: 9 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 30 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: 18, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { color: colors.muted },
  total: { color: colors.primary, fontSize: 24, fontWeight: '900', marginBottom: 12 }
});
