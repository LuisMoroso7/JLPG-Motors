import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

const SPECS = [
  { key: 'price', label: 'Preço', format: (v, vehicle) => formatCurrency(v, vehicle.targetCurrency || 'BRL'), better: 'lower' },
  { key: 'year', label: 'Ano', format: (v) => String(v), better: 'higher' },
  { key: 'km', label: 'Quilometragem', format: (v) => `${Number(v).toLocaleString('pt-BR')} km`, better: 'lower' },
  { key: 'transmission', label: 'Câmbio', format: (v) => v, better: null },
  { key: 'fuel', label: 'Combustível', format: (v) => v, better: null },
  { key: 'color', label: 'Cor', format: (v) => v, better: null },
  { key: 'category', label: 'Categoria', format: (v) => v, better: null },
  { key: 'stock', label: 'Estoque', format: (v) => `${v} un.`, better: 'higher' },
];

export default function CompareScreen({ navigation, vehicles = [], compareVehicles = [], setCompareVehicles, addToProposal}) {
  const [step, setStep] = useState('select'); // 'select' | 'result'
  const [selected, setSelected] = useState([]);

  // Se já tem 2 veículos do estado global, vai direto pra resultado
  const showResult = (compareVehicles.length === 2) || (step === 'result' && selected.length === 2);
  const [a, b] = compareVehicles.length === 2 ? compareVehicles : selected;

  function toggleSelect(vehicle) {
    setSelected((curr) => {
      if (curr.find((v) => v.id === vehicle.id)) return curr.filter((v) => v.id !== vehicle.id);
      if (curr.length >= 2) return [curr[1], vehicle];
      return [...curr, vehicle];
    });
  }

  function isBetter(spec, valA, valB) {
    if (!spec.better) return false;
    if (spec.better === 'higher') return valA > valB;
    if (spec.better === 'lower') return valA < valB;
    return false;
  }

  function clearAll() {
    setSelected([]);
    setCompareVehicles?.([]);
    setStep('select');
  }

  // TELA DE SELEÇÃO
  if (!showResult) {
    return (
      <Screen style={{ backgroundColor: colors.background }}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Comparar</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Selecione 2 veículos para comparar ({selected.length}/2)
          </Text>
          {selected.length === 2 && (
            <TouchableOpacity
              style={[styles.compareBtn, { backgroundColor: colors.primary }]}
              onPress={() => setStep('result')}
            >
              <Ionicons name="git-compare" size={16} color={colors.background} />
              <Text style={[styles.compareBtnText, { color: colors.background }]}>Comparar agora</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Preview dos selecionados */}
        {selected.length > 0 && (
          <View style={[styles.selectedBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {selected.map((v) => (
              <View key={v.id} style={styles.selectedItem}>
                {v.image ? (
                  <Image source={{ uri: v.image }} style={styles.selectedThumb} />
                ) : (
                  <View style={[styles.selectedThumb, { backgroundColor: colors.surface }]}>
                    <Ionicons name="car-outline" size={16} color={colors.muted} />
                  </View>
                )}
                <Text style={[styles.selectedName, { color: colors.text }]} numberOfLines={1}>{v.name.split(' ').slice(0,2).join(' ')}</Text>
                <TouchableOpacity onPress={() => toggleSelect(v)}>
                  <Ionicons name="close-circle" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
            {selected.length === 1 && (
              <View style={[styles.selectedSlot, { borderColor: colors.border }]}>
                <Ionicons name="add" size={20} color={colors.muted} />
                <Text style={[styles.selectedSlotText, { color: colors.muted }]}>Selecione</Text>
              </View>
            )}
          </View>
        )}

        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.vehicleList, { paddingBottom: 40 }]}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selected.find((v) => v.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.vehicleChip,
                  { backgroundColor: colors.card, borderColor: isSelected ? colors.primary : colors.border },
                  isSelected && { backgroundColor: `${colors.primary}12` }
                ]}
                onPress={() => toggleSelect(item)}
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.vehicleChipImage} />
                ) : (
                  <View style={[styles.vehicleChipImage, { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name="car-outline" size={20} color={colors.muted} />
                  </View>
                )}
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={12} color={colors.background} />
                  </View>
                )}
                <View style={styles.vehicleChipInfo}>
                  <Text style={[styles.vehicleChipName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
                  <Text style={[styles.vehicleChipPrice, { color: colors.primary }]}>{formatCurrency(item.price, item.targetCurrency || 'BRL')}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </Screen>
    );
  }

  // TELA DE RESULTADO
  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.resultHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={clearAll}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Comparativo</Text>
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Cabeçalho dos veículos */}
        <View style={styles.vehicleHeaders}>
          {[a, b].map((v) => (
            <View key={v.id} style={[styles.vehicleHeader, { borderColor: colors.border }]}>
              {v.image ? (
                <Image source={{ uri: v.image }} style={styles.vehicleImg} />
              ) : (
                <View style={[styles.vehicleImg, { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="car-outline" size={28} color={colors.muted} />
                </View>
              )}
              <LinearGradient colors={['transparent', 'rgba(10,10,15,0.85)']} style={StyleSheet.absoluteFill} />
              <View style={styles.vehicleHeaderInfo}>
                <Text style={styles.vehicleHeaderName} numberOfLines={2}>{v.name}</Text>
                <Text style={styles.vehicleHeaderPrice}>{formatCurrency(v.price, v.targetCurrency || 'BRL')}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tabela */}
        <View style={[styles.table, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {SPECS.map((spec, i) => {
            const valA = a[spec.key];
            const valB = b[spec.key];
            const aWins = isBetter(spec, valA, valB);
            const bWins = isBetter(spec, valB, valA);
            return (
              <View key={spec.key} style={[styles.row, i % 2 === 0 && { backgroundColor: 'rgba(255,255,255,0.02)' }]}>
                <View style={[styles.cell, aWins && styles.cellWin]}>
                  <Text style={[styles.cellValue, { color: aWins ? colors.success : colors.textSecondary }]}>
                    {spec.format(valA, a)}
                  </Text>
                  {aWins && <Ionicons name="trending-up" size={11} color={colors.success} />}
                </View>
                <View style={[styles.labelCell, { borderLeftColor: colors.border, borderRightColor: colors.border }]}>
                  <Text style={[styles.specLabel, { color: colors.muted }]}>{spec.label}</Text>
                </View>
                <View style={[styles.cell, bWins && styles.cellWin]}>
                  <Text style={[styles.cellValue, { color: bWins ? colors.success : colors.textSecondary }]}>
                    {spec.format(valB, b)}
                  </Text>
                  {bWins && <Ionicons name="trending-up" size={11} color={colors.success} />}
                </View>
              </View>
            );
          })}
        </View>

        {/* Veredito */}
        <LinearGradient colors={[`${colors.primary}18`, `${colors.primary}05`]} style={[styles.verdict, { borderColor: `${colors.primary}30` }]}>
          <Ionicons name="trophy-outline" size={28} color={colors.primary} />
          <Text style={[styles.verdictTitle, { color: colors.muted }]}>Melhor custo-benefício</Text>
          <Text style={[styles.verdictName, { color: colors.text }]}>
            {a.price <= b.price && a.km <= b.km ? a.name : b.price <= a.price && b.km <= a.km ? b.name : 'Depende da sua prioridade!'}
          </Text>
        </LinearGradient>

        <View style={styles.actions}>
          <PrimaryButton title={`Proposta: ${a.name.split(' ').slice(0,2).join(' ')}`} onPress={() => { addToProposal?.(a); navigation.navigate('Proposta'); }} />
          <PrimaryButton title={`Proposta: ${b.name.split(' ').slice(0,2).join(' ')}`} variant="outline" onPress={() => { addToProposal?.(b); navigation.navigate('Proposta'); }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 10 },
  title: { fontSize: 26, fontWeight: '900', marginTop: 8 },
  subtitle: { fontSize: 13, marginTop: 4, marginBottom: 12 },
  compareBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, marginTop: 4 },
  compareBtnText: { fontWeight: '900', fontSize: 14 },
  selectedBar: { flexDirection: 'row', gap: 10, padding: 12, marginHorizontal: 18, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  selectedItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  selectedThumb: { width: 36, height: 36, borderRadius: 8 },
  selectedName: { flex: 1, fontSize: 12, fontWeight: '700' },
  selectedSlot: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, padding: 8 },
  selectedSlotText: { fontSize: 12 },
  vehicleList: { padding: 12 },
  vehicleChip: { flex: 1, margin: 5, borderRadius: 16, borderWidth: 1.5, overflow: 'hidden' },
  vehicleChipImage: { width: '100%', height: 100 },
  checkBadge: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  vehicleChipInfo: { padding: 10 },
  vehicleChipName: { fontSize: 12, fontWeight: '800', marginBottom: 3 },
  vehicleChipPrice: { fontSize: 13, fontWeight: '900' },
  container: { padding: 18, paddingBottom: 40 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 },
  backBtn: { padding: 4 },
  clearBtn: { padding: 4 },
  vehicleHeaders: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  vehicleHeader: { flex: 1, height: 150, borderRadius: 18, overflow: 'hidden', position: 'relative', borderWidth: 1 },
  vehicleImg: { width: '100%', height: '100%' },
  vehicleHeaderInfo: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  vehicleHeaderName: { color: '#fff', fontWeight: '900', fontSize: 12, lineHeight: 16 },
  vehicleHeaderPrice: { color: '#C9A227', fontWeight: '900', fontSize: 14, marginTop: 2 },
  table: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, padding: 12, alignItems: 'center', gap: 3 },
  cellWin: { backgroundColor: 'rgba(61,220,132,0.06)' },
  cellValue: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  labelCell: { width: 80, alignItems: 'center', padding: 10, borderLeftWidth: 1, borderRightWidth: 1 },
  specLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.3 },
  verdict: { borderRadius: 20, padding: 20, alignItems: 'center', gap: 6, borderWidth: 1, marginBottom: 16 },
  verdictTitle: { fontSize: 13 },
  verdictName: { fontSize: 16, fontWeight: '900', textAlign: 'center' },
  actions: { gap: 12 },
});
