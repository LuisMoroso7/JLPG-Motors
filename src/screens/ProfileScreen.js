import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
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

function MenuItem({ icon, label, onPress, danger = false }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {!danger && <Ionicons name="chevron-forward" size={16} color={colors.muted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ user, setUser, orders, favorites }) {
  function handleLogout() {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => setUser(null) },
      ]
    );
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'JL';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <LinearGradient
          colors={['rgba(201,162,39,0.15)', 'transparent']}
          style={styles.avatarArea}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name={user?.role === 'ADMIN' ? 'shield-checkmark' : 'person-circle-outline'}
              size={13}
              color={colors.primary}
            />
            <Text style={styles.roleText}>
              {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </Text>
          </View>
        </LinearGradient>

        {/* Stats */}
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
            <Text style={styles.statValue}>{user?.role === 'ADMIN' ? 'Admin' : 'Client'}</Text>
            <Text style={styles.statLabel}>Perfil</Text>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações pessoais</Text>
          <View style={styles.card}>
            <InfoRow icon="person-outline" label="Nome" value={user?.name} />
            <View style={styles.separator} />
            <InfoRow icon="mail-outline" label="E-mail" value={user?.email} />
            {user?.phone && (
              <>
                <View style={styles.separator} />
                <InfoRow icon="call-outline" label="Telefone" value={user?.phone} />
              </>
            )}
          </View>
        </View>

        {/* Sobre o App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o aplicativo</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Ionicons name="car-sport" size={28} color={colors.primary} />
              <View style={styles.aboutContent}>
                <Text style={styles.aboutName}>JLPG Motors</Text>
                <Text style={styles.aboutVersion}>Versão 1.0.0</Text>
              </View>
            </View>
            <Text style={styles.aboutDesc}>
              Aplicativo mobile para compra de veículos premium. Navegue pelo catálogo, salve favoritos, monte propostas e acompanhe seu histórico de solicitações.
            </Text>
          </View>
        </View>

        {/* Sair */}
        <View style={styles.section}>
          <View style={styles.card}>
            <MenuItem icon="log-out-outline" label="Sair da conta" onPress={handleLogout} danger />
          </View>
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  avatarArea: { alignItems: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 20 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  avatarText: { color: colors.primary, fontSize: 32, fontWeight: '900' },
  userName: { color: colors.text, fontSize: 22, fontWeight: '900' },
  userEmail: { color: colors.muted, fontSize: 13, marginTop: 4 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10,
    backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.3)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  roleText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.card, marginHorizontal: 18,
    borderRadius: 18, borderWidth: 1, borderColor: colors.border,
    marginBottom: 24, overflow: 'hidden',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { color: colors.text, fontWeight: '900', fontSize: 20 },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { paddingHorizontal: 18, marginBottom: 16 },
  sectionTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  card: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  infoIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { color: colors.muted, fontSize: 11, marginBottom: 2 },
  infoValue: { color: colors.text, fontWeight: '700', fontSize: 14 },
  separator: { height: 1, backgroundColor: colors.border, marginLeft: 62 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  menuIconDanger: { backgroundColor: 'rgba(229,72,77,0.1)' },
  menuLabel: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 14 },
  menuLabelDanger: { color: colors.danger },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  aboutContent: {},
  aboutName: { color: colors.text, fontWeight: '900', fontSize: 16 },
  aboutVersion: { color: colors.muted, fontSize: 12 },
  aboutDesc: { color: colors.muted, fontSize: 13, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },
});
