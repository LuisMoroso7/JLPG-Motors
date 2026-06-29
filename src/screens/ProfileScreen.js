import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Screen from '../components/Screen';
import FadeInView from '../components/FadeInView';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

function MenuItem({ icon, label, onPress, danger = false, right }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} accessibilityLabel={label} accessibilityRole="button">
      <View style={[styles.menuIcon, { backgroundColor: danger ? 'rgba(229,72,77,0.1)' : 'rgba(201,162,39,0.1)' }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
      {right || (!danger && <Ionicons name="chevron-forward" size={16} color={colors.muted} />)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ user, setUser, orders, favorites, priceAlerts = [] }) {
  const [avatar, setAvatar] = useState(null);

  async function pickAvatar() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert('Permissão necessária', 'Permita o acesso à galeria.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  }

  function handleLogout() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => setUser(null) },
    ]);
  }

  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'JL';

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <FadeInView delay={0}>
          <LinearGradient colors={['rgba(201,162,39,0.15)', 'transparent']} style={styles.avatarArea}>
            <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrapper}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={14} color={colors.background} />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name={user?.role === 'ADMIN' ? 'shield-checkmark' : 'person-circle-outline'} size={13} color={colors.primary} />
              <Text style={styles.roleText}>{user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</Text>
            </View>
          </LinearGradient>
        </FadeInView>

        {/* Stats */}
        <FadeInView delay={100}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{orders?.length || 0}</Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{favorites?.length || 0}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{priceAlerts?.length || 0}</Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
          </View>
        </FadeInView>

        {/* Info pessoal */}
        <FadeInView delay={150}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações pessoais</Text>
            <View style={styles.card}>
              <InfoRow icon="person-outline" label="Nome" value={user?.name} />
              <View style={styles.separator} />
              <InfoRow icon="mail-outline" label="E-mail" value={user?.email} />
              {user?.phone && <>
                <View style={styles.separator} />
                <InfoRow icon="call-outline" label="Telefone" value={user?.phone} />
              </>}
            </View>
          </View>
        </FadeInView>

        {/* Alertas de preço */}
        {priceAlerts?.length > 0 && (
          <FadeInView delay={180}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alertas de preço</Text>
              <View style={styles.card}>
                {priceAlerts.map((alert, i) => (
                  <View key={alert.id}>
                    <View style={styles.alertRow}>
                      <Ionicons name="notifications-outline" size={16} color={colors.primary} />
                      <View style={styles.alertInfo}>
                        <Text style={styles.alertName} numberOfLines={1}>{alert.vehicleName}</Text>
                        <Text style={styles.alertPrice}>Alerta em {formatCurrency(alert.targetPrice)}</Text>
                      </View>
                      <View style={styles.alertActiveBadge}>
                        <Text style={styles.alertActiveText}>Ativo</Text>
                      </View>
                    </View>
                    {i < priceAlerts.length - 1 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            </View>
          </FadeInView>
        )}

        {/* Sobre */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o aplicativo</Text>
            <View style={styles.card}>
              <View style={styles.aboutRow}>
                <Ionicons name="car-sport" size={28} color={colors.primary} />
                <View>
                  <Text style={styles.aboutName}>JLPG Motors</Text>
                  <Text style={styles.aboutVersion}>Versão 1.0.0</Text>
                </View>
              </View>
              <Text style={styles.aboutDesc}>
                Plataforma mobile para compra e negociação de veículos premium com atendimento personalizado.
              </Text>
            </View>
          </View>
        </FadeInView>

        {/* Sair */}
        <FadeInView delay={220}>
          <View style={styles.section}>
            <View style={styles.card}>
              <MenuItem icon="log-out-outline" label="Sair da conta" onPress={handleLogout} danger />
            </View>
          </View>
        </FadeInView>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  avatarArea: { alignItems: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatarImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: colors.primary },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primary, fontSize: 32, fontWeight: '900' },
  avatarEditBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background },
  userName: { color: colors.text, fontSize: 22, fontWeight: '900' },
  userEmail: { color: colors.muted, fontSize: 13, marginTop: 4 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  roleText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  statsRow: { flexDirection: 'row', marginHorizontal: 18, backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 24, overflow: 'hidden' },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 20 },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { paddingHorizontal: 18, marginBottom: 16 },
  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  card: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(201,162,39,0.1)', alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.muted, fontSize: 11, marginBottom: 2 },
  infoValue: { color: colors.text, fontWeight: '700', fontSize: 14 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 62 },
  alertRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  alertInfo: { flex: 1 },
  alertName: { color: colors.text, fontWeight: '800', fontSize: 14 },
  alertPrice: { color: colors.muted, fontSize: 12, marginTop: 2 },
  alertActiveBadge: { backgroundColor: 'rgba(61,220,132,0.1)', borderWidth: 1, borderColor: 'rgba(61,220,132,0.3)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  alertActiveText: { color: colors.success, fontSize: 11, fontWeight: '700' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 14 },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  aboutName: { color: colors.text, fontWeight: '900', fontSize: 16 },
  aboutVersion: { color: colors.muted, fontSize: 12 },
  aboutDesc: { color: colors.muted, fontSize: 13, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },
});
