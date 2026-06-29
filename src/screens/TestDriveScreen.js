import React, { useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const HOURS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const DAYS_AHEAD = 14;

function getAvailableDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) dates.push(d); // sem domingo
  }
  return dates;
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function TestDriveScreen({ route, navigation, user, testDrives = [], saveTestDrive }) {
  const vehicle = route?.params?.vehicle;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [loading, setLoading] = useState(false);
  const dates = getAvailableDates();

  // Horários ocupados mockados
  const busySlots = ['10:00', '14:00'];

  async function handleConfirm() {
    if (!selectedDate || !selectedHour) {
      Alert.alert('Selecione data e horário', 'Por favor selecione uma data e um horário para o test drive.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    const protocol = `TD${String(Date.now()).slice(-6)}`;
    saveTestDrive?.({
      id: protocol,
      vehicleId: vehicle?.id,
      vehicleName: vehicle?.name || 'Veículo',
      date: formatDate(selectedDate),
      hour: selectedHour,
      protocol,
      status: 'confirmed',
    });
    Alert.alert(
      '✅ Test drive agendado!',
      `Protocolo: ${protocol}\nVeículo: ${vehicle?.name || 'Veículo'}\nData: ${formatDate(selectedDate)} às ${selectedHour}\n\nNossa equipe confirmará por contato.`,
      [{ text: 'Ok', onPress: () => navigation.goBack() }]
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="car-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.title}>Agendar Test Drive</Text>
          {vehicle && <Text style={styles.vehicleName}>{vehicle.name}</Text>}
          <Text style={styles.subtitle}>Escolha a melhor data e horário para conhecer o veículo.</Text>
        </View>

        {/* Info da loja */}
        <View style={styles.storeCard}>
          <View style={styles.storeIcon}>
            <Ionicons name="location" size={20} color={colors.primary} />
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>JLPG Motors — Passo Fundo</Text>
            <Text style={styles.storeAddress}>Passo Fundo, RS</Text>
            <Text style={styles.storeHours}>Seg–Sáb: 09h às 18h</Text>
          </View>
        </View>

        {/* Datas */}
        <Text style={styles.sectionLabel}>Selecione a data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
          {dates.map((date, i) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const parts = formatDate(date).split(', ');
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedDate(date)}
                style={[styles.dateChip, isSelected && styles.dateChipActive]}
              >
                <Text style={[styles.dateWeekday, isSelected && styles.dateTextActive]}>
                  {date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                </Text>
                <Text style={[styles.dateDay, isSelected && styles.dateTextActive]}>
                  {date.getDate()}
                </Text>
                <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>
                  {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Horários */}
        <Text style={styles.sectionLabel}>Selecione o horário</Text>
        <View style={styles.hoursGrid}>
          {HOURS.map((hour) => {
            const isBusy = busySlots.includes(hour);
            const isSelected = selectedHour === hour;
            return (
              <TouchableOpacity
                key={hour}
                onPress={() => !isBusy && setSelectedHour(hour)}
                style={[styles.hourChip, isSelected && styles.hourChipActive, isBusy && styles.hourChipBusy]}
                disabled={isBusy}
              >
                <Text style={[styles.hourText, isSelected && styles.hourTextActive, isBusy && styles.hourTextBusy]}>
                  {hour}
                </Text>
                {isBusy && <Text style={styles.busyLabel}>Ocupado</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Resumo */}
        {selectedDate && selectedHour && (
          <LinearGradient colors={['rgba(201,162,39,0.12)', 'rgba(201,162,39,0.04)']} style={styles.summaryCard}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Resumo do agendamento</Text>
              <Text style={styles.summaryText}>{formatDate(selectedDate)} às {selectedHour}</Text>
              {vehicle && <Text style={styles.summaryVehicle}>{vehicle.name}</Text>}
            </View>
          </LinearGradient>
        )}

        <PrimaryButton
          title="Confirmar agendamento"
          onPress={handleConfirm}
          loading={loading}
          disabled={!selectedDate || !selectedHour}
          style={styles.confirmBtn}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 22, marginTop: 8 },
  headerIcon: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  vehicleName: { color: colors.primary, fontWeight: '800', fontSize: 15, marginTop: 4 },
  subtitle: { color: colors.muted, textAlign: 'center', fontSize: 13, marginTop: 6, lineHeight: 18 },
  storeCard: {
    flexDirection: 'row', gap: 12, backgroundColor: colors.card,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 22,
  },
  storeIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(201,162,39,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  storeInfo: { flex: 1 },
  storeName: { color: colors.text, fontWeight: '900', fontSize: 14 },
  storeAddress: { color: colors.muted, fontSize: 12, marginTop: 2 },
  storeHours: { color: colors.success, fontSize: 12, marginTop: 2, fontWeight: '600' },
  sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  datesScroll: { gap: 10, marginBottom: 22, paddingBottom: 2 },
  dateChip: {
    width: 64, paddingVertical: 12, borderRadius: 16, alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  dateChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateWeekday: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  dateDay: { color: colors.text, fontSize: 22, fontWeight: '900', marginVertical: 2 },
  dateMonth: { color: colors.muted, fontSize: 11 },
  dateTextActive: { color: colors.background },
  hoursGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  hourChip: {
    width: '30%', paddingVertical: 14, borderRadius: 14, alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  hourChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  hourChipBusy: { backgroundColor: 'rgba(229,72,77,0.06)', borderColor: 'rgba(229,72,77,0.2)' },
  hourText: { color: colors.text, fontWeight: '800', fontSize: 15 },
  hourTextActive: { color: colors.background },
  hourTextBusy: { color: colors.muted },
  busyLabel: { color: colors.danger, fontSize: 9, marginTop: 2, fontWeight: '700' },
  summaryCard: {
    flexDirection: 'row', gap: 12, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)', marginBottom: 18,
  },
  summaryContent: { flex: 1 },
  summaryTitle: { color: colors.text, fontWeight: '900', fontSize: 14 },
  summaryText: { color: colors.primary, fontWeight: '800', fontSize: 15, marginTop: 3 },
  summaryVehicle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  confirmBtn: {},
});
