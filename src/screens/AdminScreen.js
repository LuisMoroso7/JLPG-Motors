import React from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

export default function AdminScreen({ navigation, vehicles, deleteVehicle, user }) {
  if (user?.role !== 'ADMIN') {
    return (
      <Screen>
        <View style={styles.blocked}>
          <Text style={styles.title}>Acesso restrito</Text>
          <Text style={styles.subtitle}>Entre com uma conta administradora para cadastrar, editar e remover veículos.</Text>
        </View>
      </Screen>
    );
  }

  function confirmDelete(vehicle) {
    Alert.alert('Remover veículo', `Deseja remover ${vehicle.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => deleteVehicle(vehicle.id) }
    ]);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Administração</Text>
        <Text style={styles.subtitle}>Manutenção do catálogo de veículos.</Text>
        <PrimaryButton title="Cadastrar veículo" onPress={() => navigation.navigate('FormulárioVeículo')} style={styles.createButton} />
      </View>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <View style={styles.actions}>
                <PrimaryButton title="Editar" onPress={() => navigation.navigate('FormulárioVeículo', { vehicleId: item.id })} style={styles.actionButton} />
                <PrimaryButton title="Excluir" variant="danger" onPress={() => confirmDelete(item)} style={styles.actionButton} />
              </View>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 18, paddingBottom: 6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, marginTop: 6 },
  createButton: { marginTop: 18 },
  list: { padding: 18, paddingBottom: 30 },
  item: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 18, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  image: { width: 115, height: 140 },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  name: { color: colors.text, fontWeight: '900' },
  price: { color: colors.primary, fontWeight: '900', marginTop: 6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  actionButton: { flex: 1, paddingVertical: 9 },
  blocked: { flex: 1, padding: 24, justifyContent: 'center' }
});
