import React, { useState } from 'react';
import {
  Alert, Dimensions, FlatList, Image, Modal, ScrollView,
  Share, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency, calcFinancing } from '../utils/formatCurrency';
import { apiConvertCurrency } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MONTHS_OPTIONS = [12, 24, 36, 48, 60];

function Spec({ icon, label, value }) {
  return (
    <View style={styles.spec}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function DetailsScreen({ route, navigation, vehicles, favorites, toggleFavorite, addToProposal, addRecentlyViewed, addPriceAlert, loadVehicleDetails }) {
  const initialVehicle = vehicles.find((item) => item.id === route.params.vehicleId);
  const [remoteVehicle, setRemoteVehicle] = useState(null);
  const vehicle = remoteVehicle || initialVehicle;
  const [activePhoto, setActivePhoto] = useState(0);
  const [downPayment, setDownPayment] = useState('');
  const [months, setMonths] = useState(48);
  const [showFinancing, setShowFinancing] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [priceConversions, setPriceConversions] = useState([]);

  React.useEffect(() => {
    let active = true;

    async function loadDetails() {
      setRemoteVehicle(null);
      try {
        const updated = await loadVehicleDetails?.(route.params.vehicleId);
        if (active && updated) setRemoteVehicle(updated);
      } catch (e) {}
    }

    loadDetails();
    return () => { active = false; };
  }, [route.params.vehicleId]);

  React.useEffect(() => {
    if (vehicle) addRecentlyViewed?.(vehicle);
  }, [vehicle?.id]);

  React.useEffect(() => {
    let active = true;

    async function loadConversions() {
      if (!vehicle?.price) {
        setPriceConversions([]);
        return;
      }

      try {
        const source = vehicle.targetCurrency || 'BRL';
        const data = await Promise.all([
          apiConvertCurrency({ source, target: 'USD', amount: vehicle.price }),
          apiConvertCurrency({ source, target: 'EUR', amount: vehicle.price }),
        ]);
        if (active) setPriceConversions(data);
      } catch (e) {
        if (active) setPriceConversions([]);
      }
    }

    loadConversions();
    return () => { active = false; };
  }, [vehicle?.id, vehicle?.price, vehicle?.targetCurrency]);

  if (!vehicle) {
    return (
      <Screen style={styles.center}>
        <Ionicons name="alert-circle-outline" size={54} color={colors.muted} />
        <Text style={styles.notFoundTitle}>Veículo não encontrado</Text>
        <PrimaryButton title="Voltar" onPress={() => navigation.goBack()} style={styles.backBtn} />
      </Screen>
    );
  }

  const isFav = favorites.includes(vehicle.id);
  const images = vehicle.images?.length > 0 ? vehicle.images : vehicle.image ? [vehicle.image] : [];
  const downVal = Number(downPayment) || 0;
  const installment = calcFinancing({ price: vehicle.price, downPayment: downVal, months });


  function handlePriceAlert() {
    setAlertPrice(String(Math.round(vehicle.price * 0.9)));
    setShowAlertModal(true);
  }

  function confirmPriceAlert() {
    const targetPrice = Number(alertPrice);
    if (!targetPrice || targetPrice <= 0) { Alert.alert('Valor inválido', 'Digite um preço válido.'); return; }
    addPriceAlert?.({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      currentPrice: vehicle.price,
      targetPrice,
      currency: vehicle.targetCurrency || 'BRL',
      targetPriceFormatted: formatCurrency(targetPrice, vehicle.targetCurrency || 'BRL'),
    });
    setShowAlertModal(false);
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `🚗 ${vehicle.name} — ${formatCurrency(vehicle.price, vehicle.targetCurrency || 'BRL')}\n${vehicle.year} | ${Number(vehicle.km || 0).toLocaleString('pt-BR')} km | ${vehicle.transmission}\n\nVeja na JLPG Motors!`,
      });
    } catch (e) {}
  }

  return (
    <Screen noSafe>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Galeria */}
        <View style={styles.galleryContainer}>
          <FlatList
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActivePhoto(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.galleryImage} />}
          />
          <LinearGradient colors={['rgba(10,10,15,0.5)', 'transparent', 'rgba(10,10,15,0.9)']} style={StyleSheet.absoluteFill} pointerEvents="none" />

          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => <View key={i} style={[styles.dot, i === activePhoto && styles.dotActive]} />)}
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.floatingRight}>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => toggleFavorite(vehicle.id)}>
              <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? colors.danger : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.imageBottom}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{vehicle.category}</Text>
            </View>
            <View style={[styles.stockBadge, { borderColor: vehicle.stock > 0 ? colors.success : colors.danger }]}>
              <Ionicons name="checkmark-circle" size={12} color={vehicle.stock > 0 ? colors.success : colors.danger} />
              <Text style={[styles.stockText, { color: vehicle.stock > 0 ? colors.success : colors.danger }]}>
                {vehicle.stock > 0 ? 'Disponível' : 'Indisponível'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.price}>{formatCurrency(vehicle.price, vehicle.targetCurrency || 'BRL')}</Text>
          {priceConversions.length > 0 && (
            <View style={styles.currencyRow}>
              {priceConversions.map((item) => (
                <View key={item.target} style={styles.currencyPill}>
                  <Text style={styles.currencyLabel}>{item.target}</Text>
                  <Text style={styles.currencyValue}>{formatCurrency(item.convertedAmount, item.target)}</Text>
                </View>
              ))}
            </View>
          )}
          <Text style={styles.description}>{vehicle.description}</Text>

          {/* Specs */}
          <Text style={styles.sectionTitle}>Especificações</Text>
          <View style={styles.specGrid}>
            <Spec icon="calendar-outline" label="Ano" value={vehicle.year} />
            <Spec icon="speedometer-outline" label="Quilometragem" value={`${vehicle.km.toLocaleString('pt-BR')} km`} />
            <Spec icon="git-branch-outline" label="Câmbio" value={vehicle.transmission} />
            <Spec icon="flame-outline" label="Combustível" value={vehicle.fuel} />
            <Spec icon="color-palette-outline" label="Cor" value={vehicle.color} />
            <Spec icon="cube-outline" label="Estoque" value={`${vehicle.stock} un.`} />
          </View>

          {/* Ações rápidas */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Chat', { vehicle })}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
              <Text style={styles.quickActionText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('TestDrive', { vehicle })}>
              <Ionicons name="car-outline" size={20} color={colors.info} />
              <Text style={styles.quickActionText}>Test Drive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Avaliações', { vehicle })}>
              <Ionicons name="star-outline" size={20} color={colors.primary} />
              <Text style={styles.quickActionText}>Avaliações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Loja')}>
              <Ionicons name="location-outline" size={20} color={colors.success} />
              <Text style={styles.quickActionText}>Loja</Text>
            </TouchableOpacity>
          </View>

          {/* Simulador financiamento */}
          <TouchableOpacity style={styles.financingToggle} onPress={() => setShowFinancing(!showFinancing)}>
            <View style={styles.financingToggleLeft}>
              <Ionicons name="calculator-outline" size={20} color={colors.primary} />
              <Text style={styles.financingToggleText}>Simulador de financiamento</Text>
            </View>
            <Ionicons name={showFinancing ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
          </TouchableOpacity>

          {showFinancing && (
            <View style={styles.financingCard}>
              <Text style={styles.financingTitle}>💰 Simule seu financiamento</Text>
              <Text style={styles.financingSubtitle}>Taxa de 1,49% a.m. • Simulação estimada</Text>
              <Text style={styles.financingLabel}>Valor de entrada (R$)</Text>
              <View style={styles.financingInputRow}>
                <Ionicons name="cash-outline" size={16} color={colors.muted} />
                <Text style={styles.financingInput} onPress={() =>
                  Alert.prompt('Entrada', 'Digite o valor de entrada', (text) => setDownPayment(text), 'plain-text', downPayment)
                }>
                  {downPayment ? `R$ ${Number(downPayment).toLocaleString('pt-BR')}` : 'Toque para digitar'}
                </Text>
              </View>
              <Text style={styles.financingLabel}>Prazo</Text>
              <View style={styles.monthsRow}>
                {MONTHS_OPTIONS.map((m) => (
                  <TouchableOpacity key={m} onPress={() => setMonths(m)} style={[styles.monthChip, months === m && styles.monthChipActive]}>
                    <Text style={[styles.monthChipText, months === m && styles.monthChipTextActive]}>{m}x</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <LinearGradient colors={['rgba(201,162,39,0.15)', 'rgba(201,162,39,0.05)']} style={styles.installmentBox}>
                <Text style={styles.installmentLabel}>Parcela estimada</Text>
                <Text style={styles.installmentValue}>{formatCurrency(installment)}/mês</Text>
                <Text style={styles.installmentObs}>{months}x de {formatCurrency(installment)} • Entrada: {formatCurrency(downVal)}</Text>
              </LinearGradient>
            </View>
          )}


          {/* Veículos similares */}
          {(() => {
            const similar = vehicles?.filter((v) => v.id !== vehicle.id && (v.category === vehicle.category || v.brand === vehicle.brand)).slice(0, 4);
            if (!similar?.length) return null;
            return (
              <View style={styles.similarSection}>
                <Text style={styles.sectionTitle}>Veículos similares</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarScroll}>
                  {similar.map((v) => (
                    <TouchableOpacity key={v.id} style={styles.similarCard}
                      onPress={() => navigation.replace('Detalhes', { vehicleId: v.id })}>
                      {v.image ? <Image source={{ uri: v.image }} style={styles.similarImage} /> : <View style={[styles.similarImage, { backgroundColor: colors.card }]}><Ionicons name="car-outline" size={24} color={colors.muted} /></View>}
                      <LinearGradient colors={['transparent', 'rgba(10,10,15,0.9)']} style={StyleSheet.absoluteFill} />
                      <View style={styles.similarInfo}>
                        <Text style={styles.similarName} numberOfLines={1}>{v.name}</Text>
                        <Text style={styles.similarPrice}>{formatCurrency(v.price, v.targetCurrency || 'BRL')}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          })()}

          {/* Ações principais */}
          <View style={styles.actions}>
            <PrimaryButton title="Adicionar à proposta" onPress={() => { addToProposal(vehicle); navigation.navigate('Proposta'); }} />
            <PrimaryButton title={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'} variant="outline" onPress={() => toggleFavorite(vehicle.id)} />
            <PrimaryButton title="Compartilhar veículo" variant="ghost" onPress={handleShare} />
            <PrimaryButton title="🔔 Criar alerta de preço" variant="outline" onPress={handlePriceAlert} />
          </View>
        </View>

        {/* Modal de alerta de preço */}
        <Modal visible={showAlertModal} transparent animationType="fade">
          <View style={styles.alertModalOverlay}>
            <View style={styles.alertModalCard}>
              <Ionicons name="notifications-outline" size={28} color={colors.primary} />
              <Text style={styles.alertModalTitle}>Criar alerta de preço</Text>
              <Text style={styles.alertModalSub}>Preço atual: {formatCurrency(vehicle.price, vehicle.targetCurrency || 'BRL')}</Text>
              <Text style={styles.alertModalLabel}>Digite o preço alvo (R$)</Text>
              <TextInput
                value={alertPrice}
                onChangeText={setAlertPrice}
                keyboardType="numeric"
                placeholder="Ex: 170000"
                placeholderTextColor={colors.muted}
                style={styles.alertModalInput}
              />
              <View style={styles.alertModalActions}>
                <TouchableOpacity style={styles.alertModalCancel} onPress={() => setShowAlertModal(false)}>
                  <Text style={styles.alertModalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertModalConfirm} onPress={confirmPriceAlert}>
                  <Text style={styles.alertModalConfirmText}>Criar alerta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  galleryContainer: { height: 320, position: 'relative' },
  galleryImage: { width: SCREEN_WIDTH, height: 320 },
  dots: { position: 'absolute', bottom: 52, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: colors.primary, width: 18 },
  backButton: { position: 'absolute', top: 52, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  floatingRight: { position: 'absolute', top: 52, right: 16, gap: 8 },
  floatingBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  imageBottom: { position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { backgroundColor: 'rgba(201,162,39,0.2)', borderWidth: 1, borderColor: colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryText: { color: colors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  stockText: { fontSize: 12, fontWeight: '700' },
  content: { padding: 20 },
  vehicleName: { color: colors.text, fontSize: 26, fontWeight: '900', marginBottom: 6 },
  price: { color: colors.primary, fontSize: 30, fontWeight: '900', marginBottom: 14 },
  currencyRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  currencyPill: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8 },
  currencyLabel: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  currencyValue: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 2 },
  description: { color: colors.textSecondary, lineHeight: 22, fontSize: 14, marginBottom: 22 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 14 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  spec: { width: '47%', backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 6 },
  specLabel: { color: colors.muted, fontSize: 11 },
  specValue: { color: colors.text, fontWeight: '800', fontSize: 14 },
  quickActions: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  quickAction: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border },
  quickActionText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  financingToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  financingToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  financingToggleText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  financingCard: { backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  financingTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginBottom: 4 },
  financingSubtitle: { color: colors.muted, fontSize: 12, marginBottom: 18 },
  financingLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  financingInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.input, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  financingInput: { color: colors.text, fontSize: 15, flex: 1 },
  monthsRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  monthChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input },
  monthChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  monthChipText: { color: colors.muted, fontWeight: '700' },
  monthChipTextActive: { color: colors.background },
  installmentBox: { borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)' },
  installmentLabel: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  installmentValue: { color: colors.primary, fontSize: 28, fontWeight: '900', marginBottom: 4 },
  installmentObs: { color: colors.muted, fontSize: 11, textAlign: 'center' },
  actions: { gap: 12, marginTop: 4 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  alertModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  alertModalCard: { backgroundColor: colors.surface, borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border },
  alertModalTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  alertModalSub: { color: colors.muted, fontSize: 13 },
  alertModalLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', alignSelf: 'flex-start' },
  alertModalInput: { width: '100%', backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, color: colors.text, padding: 14, fontSize: 16 },
  alertModalActions: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 6 },
  alertModalCancel: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  alertModalCancelText: { color: colors.muted, fontWeight: '700' },
  alertModalConfirm: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  alertModalConfirmText: { color: colors.background, fontWeight: '900' },
  similarSection: { marginBottom: 20 },
  similarScroll: { gap: 12 },
  similarCard: { width: 160, height: 110, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#252535', position: 'relative' },
  similarImage: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  similarInfo: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  similarName: { color: '#fff', fontWeight: '800', fontSize: 11, marginBottom: 2 },
  similarPrice: { color: '#C9A227', fontWeight: '900', fontSize: 13 },
  notFoundTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  backBtn: { marginTop: 8 },
});

