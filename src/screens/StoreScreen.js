import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const STORE = {
  name: 'JLPG Motors',
  address: 'Ciriaco, RS',
  lat: -28.342753,
  lng: -51.885335,
  phone: '(54) 99999-0000',
  whatsapp: '5554999990000',
  email: 'contato@jlpgmotors.com.br',
  hours: [
    { day: 'Segunda a Sexta', hours: '09:00 – 18:00' },
    { day: 'Sábado', hours: '09:00 – 13:00' },
    { day: 'Domingo', hours: 'Fechado' },
  ],
};

function openMaps() {
  const url = `https://maps.google.com/?q=${STORE.lat},${STORE.lng}`;
  Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o mapa.'));
}

function openWaze() {
  const url = `https://waze.com/ul?ll=${STORE.lat},${STORE.lng}&navigate=yes`;
  Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o Waze.'));
}

function openWhatsApp() {
  const msg = encodeURIComponent('Olá! Tenho interesse em um veículo da JLPG Motors.');
  Linking.openURL(`https://wa.me/${STORE.whatsapp}?text=${msg}`).catch(() =>
    Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.')
  );
}

function callPhone() {
  Linking.openURL(`tel:${STORE.phone}`).catch(() =>
    Alert.alert('Erro', 'Não foi possível realizar a ligação.')
  );
}

export default function StoreScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Mapa estático visual */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#1A1A2E', '#16213E', '#0F3460']}
            style={styles.mapBg}
          >
            {/* Grid de ruas mockado */}
            {[...Array(6)].map((_, i) => (
              <View key={`h${i}`} style={[styles.mapLine, styles.mapLineH, { top: `${15 + i * 14}%` }]} />
            ))}
            {[...Array(6)].map((_, i) => (
              <View key={`v${i}`} style={[styles.mapLine, styles.mapLineV, { left: `${10 + i * 16}%` }]} />
            ))}
            <View style={styles.mapPin}>
              <View style={styles.mapPinOuter}>
                <View style={styles.mapPinInner}>
                  <Ionicons name="location" size={22} color="#fff" />
                </View>
              </View>
              <View style={styles.mapPinShadow} />
            </View>
            <View style={styles.mapLabel}>
              <Text style={styles.mapLabelText}>JLPG Motors — Ciriaco, RS</Text>
            </View>
          </LinearGradient>

          {/* Botões de navegação */}
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.navBtn} onPress={openMaps}>
              <Ionicons name="map" size={20} color="#4285F4" />
              <Text style={styles.navBtnText}>Google Maps</Text>
            </TouchableOpacity>
            <View style={styles.navDivider} />
            <TouchableOpacity style={styles.navBtn} onPress={openWaze}>
              <Ionicons name="navigate" size={20} color="#00D2FF" />
              <Text style={styles.navBtnText}>Waze</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info da loja */}
        <View style={styles.section}>
          <View style={styles.storeHeader}>
            <View style={styles.storeLogo}>
              <Ionicons name="car-sport" size={28} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.storeName}>{STORE.name}</Text>
              <Text style={styles.storeAddress}>{STORE.address}</Text>
            </View>
          </View>
        </View>

        {/* Contato rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem} onPress={openWhatsApp}>
              <View style={[styles.contactIcon, { backgroundColor: '#25D36618', borderColor: '#25D36640' }]}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>{STORE.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>

            <View style={styles.contactSep} />

            <TouchableOpacity style={styles.contactItem} onPress={callPhone}>
              <View style={[styles.contactIcon, { backgroundColor: `${colors.info}18`, borderColor: `${colors.info}40` }]}>
                <Ionicons name="call-outline" size={20} color={colors.info} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Telefone</Text>
                <Text style={styles.contactValue}>{STORE.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>

            <View style={styles.contactSep} />

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(`mailto:${STORE.email}`)}
            >
              <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}40` }]}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>E-mail</Text>
                <Text style={styles.contactValue}>{STORE.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Horários */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horário de funcionamento</Text>
          <View style={styles.hoursCard}>
            {STORE.hours.map((item, i) => (
              <View key={i}>
                <View style={styles.hourRow}>
                  <Text style={styles.hourDay}>{item.day}</Text>
                  <Text style={[styles.hourValue, item.hours === 'Fechado' && styles.hourClosed]}>
                    {item.hours}
                  </Text>
                </View>
                {i < STORE.hours.length - 1 && <View style={styles.hourSep} />}
              </View>
            ))}
          </View>
        </View>

        <PrimaryButton title="Abrir no Google Maps" onPress={openMaps} style={styles.mapsBtn} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  mapContainer: { marginBottom: 22 },
  mapBg: { height: 240, position: 'relative', overflow: 'hidden' },
  mapLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.07)' },
  mapLineH: { left: 0, right: 0, height: 1 },
  mapLineV: { top: 0, bottom: 0, width: 1 },
  mapPin: { position: 'absolute', top: '35%', left: '50%', alignItems: 'center', marginLeft: -22 },
  mapPinOuter: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8,
  },
  mapPinInner: {},
  mapPinShadow: {
    width: 12, height: 6, borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.3)', marginTop: 4,
  },
  mapLabel: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
    backgroundColor: 'rgba(10,10,15,0.8)', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  mapLabelText: { color: colors.text, fontWeight: '700', fontSize: 13, textAlign: 'center' },
  navButtons: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  navBtnText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  navDivider: { width: 1, backgroundColor: colors.border },
  section: { paddingHorizontal: 18, marginBottom: 18 },
  storeHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  storeLogo: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  storeName: { color: colors.text, fontSize: 20, fontWeight: '900' },
  storeAddress: { color: colors.muted, fontSize: 13, marginTop: 2 },
  sectionTitle: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  contactCard: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  contactIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  contactInfo: { flex: 1 },
  contactLabel: { color: colors.muted, fontSize: 11 },
  contactValue: { color: colors.text, fontWeight: '700', fontSize: 14 },
  contactSep: { height: 1, backgroundColor: colors.border, marginLeft: 64 },
  hoursCard: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', padding: 4 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  hourDay: { color: colors.textSecondary, fontSize: 14 },
  hourValue: { color: colors.text, fontWeight: '800', fontSize: 14 },
  hourClosed: { color: colors.muted },
  hourSep: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
  mapsBtn: { marginHorizontal: 18 },
});
