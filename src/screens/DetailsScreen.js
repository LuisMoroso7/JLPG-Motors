import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function Spec({ label, value }) {
  return (
    <View style={styles.spec}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function DetailsScreen({ route, navigation, vehicles, favorites, toggleFavorite, addToProposal }) {
  const vehicle = vehicles.find((item) => item.id === route.params.vehicleId);
  if (!vehicle) {
    return (
      <Screen style={styles.center}>
        <Text style={styles.title}>Veículo não encontrado</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: vehicle.image }} style={styles.image} />
        <Text style={styles.category}>{vehicle.category}</Text>
        <Text style={styles.title}>{vehicle.name}</Text>
        <Text style={styles.price}>{formatCurrency(vehicle.price)}</Text>
        <Text style={styles.description}>{vehicle.description}</Text>

        <View style={styles.grid}>
          <Spec label="Ano" value={vehicle.year} />
          <Spec label="KM" value={`${vehicle.km.toLocaleString('pt-BR')} km`} />
          <Spec label="Câmbio" value={vehicle.transmission} />
          <Spec label="Combustível" value={vehicle.fuel} />
          <Spec label="Cor" value={vehicle.color} />
          <Spec label="Estoque" value={`${vehicle.stock} unidade`} />
        </View>

        <PrimaryButton title="Adicionar à proposta" onPress={() => addToProposal(vehicle)} style={styles.button} />
        <PrimaryButton
          title={favorites.includes(vehicle.id) ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          variant="outline"
          onPress={() => toggleFavorite(vehicle.id)}
          style={styles.buttonSmall}
        />
        <PrimaryButton title="Finalizar interesse" variant="outline" onPress={() => navigation.navigate('Proposta')} style={styles.buttonSmall} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  image: { width: '100%', height: 300 },
  category: { color: colors.primary, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginTop: 22, marginHorizontal: 18 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 8, marginHorizontal: 18 },
  price: { color: colors.primary, fontSize: 26, fontWeight: '900', marginTop: 8, marginHorizontal: 18 },
  description: { color: colors.muted, lineHeight: 22, marginTop: 14, marginHorizontal: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 22, marginHorizontal: 18 },
  spec: { width: '47%', backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border },
  specLabel: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  specValue: { color: colors.text, fontWeight: '800' },
  button: { marginHorizontal: 18, marginTop: 24 },
  buttonSmall: { marginHorizontal: 18, marginTop: 12 },
  center: { justifyContent: 'center', alignItems: 'center' }
});
