import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

const SPECS = [
  { key: 'price', label: 'Preço', format: (v) => formatCurrency(v), better: 'lower' },
  { key: 'year', label: 'Ano', format: (v) => String(v), better: 'higher' },
  { key: 'km', label: 'Quilometragem', format: (v) => `${v.toLocaleString('pt-BR')} km`, better: 'lower' },
  { key: 'transmission', label: 'Câmbio', format: (v) => v, better: null },
  { key: 'fuel', label: 'Combustível', format: (v) => v, better: null },
  { key: 'color', label: 'Cor', format: (v) => v, better: null },
  { key: 'category', label: 'Categoria', format: (v) => v, better: null },
  { key: 'stock', label: 'Estoque', format: (v) => `${v} un.`, better: 'higher' },
];

export default function CompareScreen({ navigation, compareVehicles, setCompareVehicles, addToProposal }) {
  const [a, b] = compareVehicles;

  if (!a || !b) {
    return (
      <Screen>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="git-compare-outline" size={40} color={colors.muted} />
          </View>
          <Text style={styles.emptyTitle}>Selecione 2 veículos</Text>
          <Text style={styles.emptyText}>No catálogo, selecione dois veículos para comparar lado a lado.</Text>
          <PrimaryButton title="Ir ao catálogo" onPress={() => navigation.navigate('Catálogo')} style={styles.emptyBtn} />
        </View>
      </Screen>
    );
  }

  function isBetter(spec, vehicleVal, otherVal) {
    if (!spec.better) return false;
    if (spec.better === 'higher') return vehicleVal > otherVal;
    if (spec.better === 'lower') return vehicleVal < otherVal;
    return false;
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Comparativo</Text>
          <TouchableOpacity onPress={() => setCompareVehicles([])} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.muted} />
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* Cabeçalho dos veículos */}
        <View style={styles.vehicleHeaders}>
          {[a, b].map((v) => (
            <View key={v.id} style={styles.vehicleHeader}>
              {v.image ? (
                <Image source={{ uri: v.image }} style={styles.vehicleImg} />
              ) : (
                <View style={[styles.vehicleImg, styles.noImg]}>
                  <Ionicons name="car-outline" size={28} color={colors.muted} />
                </View>
              )}
              <LinearGradient colors={['transparent', 'rgba(10,10,15,0.8)']} style={StyleSheet.absoluteFill} />
              <View style={styles.vehicleHeaderInfo}>
                <Text style={styles.vehicleHeaderName} numberOfLines={2}>{v.name}</Text>
                <Text style={styles.vehicleHeaderPrice}>{formatCurrency(v.price)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tabela de comparação */}
        <View style={styles.table}>
          {SPECS.map((spec, i) => {
            const valA = a[spec.key];
            const valB = b[spec.key];
            const aWins = isBetter(spec, valA, valB);
            const bWins = isBetter(spec, valB, valA);

            return (
              <View key={spec.key} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <View style={[styles.cell, aWins && styles.cellWin]}>
                  <Text style={[styles.cellValue, aWins && styles.cellValueWin]}>{spec.format(valA)}</Text>
                  {aWins && <Ionicons name="trending-up" size={12} color={colors.success} />}
                </View>
                <View style={styles.labelCell}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                </View>
                <View style={[styles.cell, bWins && styles.cellWin]}>
                  <Text style={[styles.cellValue, bWins && styles.cellValueWin]}>{spec.format(valB)}</Text>
                  {bWins && <Ionicons name="trending-up" size={12} color={colors.success} />}
                </View>
              </View>
            );
          })}
        </View>

        {/* Veredito */}
        <View style={styles.verdict}>
          <LinearGradient colors={['rgba(201,162,39,0.12)', 'rgba(201,162,39,0.04)']} style={styles.verdictGradient}>
            <Ionicons name="trophy-outline" size={28} color={colors.primary} />
            <Text style={styles.verdictTitle}>Melhor custo-benefício</Text>
            <Text style={styles.verdictName}>
              {a.price <= b.price && a.km <= b.km ? a.name : b.price <= a.price && b.km <= a.km ? b.name : 'Depende da sua prioridade!'}
            </Text>
          </LinearGradient>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <PrimaryButton title={`Proposta: ${a.name.split(' ')[0]}`} onPress={() => { addToProposal(a); navigation.navigate('Proposta'); }} />
          <PrimaryButton title={`Proposta: ${b.name.split(' ')[0]}`} variant="outline" onPress={() => { addToProposal(b); navigation.navigate('Proposta'); }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, marginTop: 10 },
  title: { color: colors.text, fontSize: 26, fontWeight: '900' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  clearText: { color: colors.muted, fontSize: 13 },
  vehicleHeaders: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  vehicleHeader: { flex: 1, height: 140, borderRadius: 18, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: colors.border },
  vehicleImg: { width: '100%', height: '100%' },
  noImg: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  vehicleHeaderInfo: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  vehicleHeaderName: { color: '#fff', fontWeight: '900', fontSize: 12, lineHeight: 16 },
  vehicleHeaderPrice: { color: colors.primary, fontWeight: '900', fontSize: 14, marginTop: 2 },
  table: { backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 18 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  cell: { flex: 1, padding: 14, alignItems: 'center', gap: 3 },
  cellWin: { backgroundColor: 'rgba(61,220,132,0.06)' },
  cellValue: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  cellValueWin: { color: colors.success },
  labelCell: { width: 90, alignItems: 'center', padding: 10, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
  specLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  verdict: { marginBottom: 18 },
  verdictGradient: { borderRadius: 20, padding: 22, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)' },
  verdictTitle: { color: colors.muted, fontSize: 13 },
  verdictName: { color: colors.text, fontSize: 17, fontWeight: '900', textAlign: 'center' },
  actions: { gap: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 20, fontSize: 13 },
  emptyBtn: { marginTop: 8 },
});
