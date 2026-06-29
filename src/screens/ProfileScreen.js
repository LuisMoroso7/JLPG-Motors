import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import FadeInView from '../components/FadeInView';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function InfoRow({ icon, label, value, colors }) {
  return (
    <View style={styles.infoRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={[styles.infoIcon, { backgroundColor: `${colors.primary}18` }]}>
        <Ionicons name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value || '—'}</Text>
      </View>
    </View>
  );
}

function MenuItem({ icon, label, onPress, danger = false, right, colors }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? `${colors.danger}18` : `${colors.primary}18` }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: danger ? colors.danger : colors.text }]}>{label}</Text>
      {right || <Ionicons name="chevron-forward" size={16} color={danger ? 'transparent' : colors.muted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ user, setUser, orders, favorites, isDark, toggleTheme, priceAlerts = []}) {

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
          <LinearGradient colors={[`${colors.primary}22`, 'transparent']} style={styles.avatarArea}>
            <View style={[styles.avatar, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>{initials}</Text>
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: colors.muted }]}>{user?.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}50` }]}>
              <Ionicons name={user?.role === 'ADMIN' ? 'shield-checkmark' : 'person-circle-outline'} size={13} color={colors.primary} />
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
              </Text>
            </View>
          </LinearGradient>
        </FadeInView>

        {/* Stats */}
        <FadeInView delay={100}>
          <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.text }]}>{orders?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Pedidos</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.text }]}>{favorites?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Favoritos</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.text }]}>{priceAlerts?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Alertas</Text>
            </View>
          </View>
        </FadeInView>

        {/* Info pessoal */}
        <FadeInView delay={150}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>Informações pessoais</Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <InfoRow icon="person-outline" label="Nome" value={user?.name} colors={colors} />
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
              <InfoRow icon="mail-outline" label="E-mail" value={user?.email} colors={colors} />
              {user?.phone && <>
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
                <InfoRow icon="call-outline" label="Telefone" value={user?.phone} colors={colors} />
              </>}
            </View>
          </View>
        </FadeInView>

        {/* Alertas de preço */}
        {priceAlerts?.length > 0 && (
          <FadeInView delay={180}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.muted }]}>Alertas de preço</Text>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {priceAlerts.map((alert, i) => (
                  <View key={alert.id}>
                    <View style={styles.alertRow}>
                      <Ionicons name="notifications-outline" size={16} color={colors.primary} />
                      <View style={styles.alertInfo}>
                        <Text style={[styles.alertName, { color: colors.text }]} numberOfLines={1}>{alert.vehicleName}</Text>
                        <Text style={[styles.alertPrice, { color: colors.muted }]}>Alerta em {formatCurrency(alert.targetPrice)}</Text>
                      </View>
                      <View style={[styles.alertActiveBadge, { backgroundColor: `${colors.success}18`, borderColor: `${colors.success}40` }]}>
                        <Text style={[styles.alertActiveText, { color: colors.success }]}>Ativo</Text>
                      </View>
                    </View>
                    {i < priceAlerts.length - 1 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
                  </View>
                ))}
              </View>
            </View>
          </FadeInView>
        )}

        {/* Preferências */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>Preferências</Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.menuItem} accessible accessibilityLabel={`Tema ${isDark ? 'escuro' : 'claro'}, toque para alternar`}>
                <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}18` }]}>
                  <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={18} color={colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>
                  Tema {isDark ? 'escuro' : 'claro'}
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: `${colors.primary}60` }}
                  thumbColor={isDark ? colors.primary : colors.muted}
                  accessibilityLabel="Alternar tema escuro/claro"
                />
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Sobre */}
        <FadeInView delay={220}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>Sobre o aplicativo</Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.aboutRow}>
                <Ionicons name="car-sport" size={28} color={colors.primary} />
                <View>
                  <Text style={[styles.aboutName, { color: colors.text }]}>JLPG Motors</Text>
                  <Text style={[styles.aboutVersion, { color: colors.muted }]}>Versão 1.0.0</Text>
                </View>
              </View>
              <Text style={[styles.aboutDesc, { color: colors.muted }]}>
                Aplicativo mobile para compra de veículos premium com atendimento personalizado.
              </Text>
            </View>
          </View>
        </FadeInView>

        {/* Sair */}
        <FadeInView delay={240}>
          <View style={styles.section}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <MenuItem icon="log-out-outline" label="Sair da conta" onPress={handleLogout} danger colors={colors} />
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
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { fontSize: 32, fontWeight: '900' },
  userName: { fontSize: 22, fontWeight: '900' },
  userEmail: { fontSize: 13, marginTop: 4 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  roleText: { fontWeight: '700', fontSize: 12 },
  statsRow: { flexDirection: 'row', marginHorizontal: 18, borderRadius: 18, borderWidth: 1, marginBottom: 24, overflow: 'hidden' },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { fontWeight: '900', fontSize: 20 },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1 },
  section: { paddingHorizontal: 18, marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, marginBottom: 2 },
  infoValue: { fontWeight: '700', fontSize: 14 },
  separator: { height: 1, marginLeft: 62 },
  alertRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  alertInfo: { flex: 1 },
  alertName: { fontWeight: '800', fontSize: 14 },
  alertPrice: { fontSize: 12, marginTop: 2 },
  alertActiveBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  alertActiveText: { fontSize: 11, fontWeight: '700' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontWeight: '700', fontSize: 14 },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  aboutName: { fontWeight: '900', fontSize: 16 },
  aboutVersion: { fontSize: 12 },
  aboutDesc: { fontSize: 13, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },
});
