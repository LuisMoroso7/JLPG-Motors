import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function ProfileScreen({ user, setUser }) {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.name}</Text>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user?.email}</Text>
          <Text style={styles.label}>Tipo de usuário</Text>
          <Text style={styles.role}>{user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.aboutTitle}>Sobre a JLPG Motors</Text>
          <Text style={styles.about}>Aplicativo mobile para venda de veículos, com catálogo, detalhes, favoritos, propostas de compra e área administrativa para manutenção dos carros.</Text>
        </View>
        <PrimaryButton title="Sair da conta" variant="danger" onPress={() => setUser(null)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 24, marginBottom: 18 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  label: { color: colors.muted, fontSize: 12, marginTop: 10 },
  value: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 4 },
  role: { color: colors.primary, fontSize: 17, fontWeight: '900', marginTop: 4 },
  aboutTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 8 },
  about: { color: colors.muted, lineHeight: 22 }
});
