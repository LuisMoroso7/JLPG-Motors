import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import VehicleCard from '../components/VehicleCard';

export default function HomeScreen({ navigation, vehicles, favorites, toggleFavorite, user }) {
  const highlights = vehicles.slice(0, 2);
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
         source={require('../../assets/splash.png')}
         imageStyle={styles.heroImage}
         style={styles.hero}
        >
          <View style={styles.overlay}>
            <Text style={styles.logo}>JLPG Motors</Text>
            <Text style={styles.title}>Encontre o carro ideal para você</Text>
            <Text style={styles.subtitle}>Catálogo premium de veículos com atendimento personalizado.</Text>
            <PrimaryButton title="Ver catálogo" onPress={() => navigation.navigate('Catálogo')} />
          </View>
        </ImageBackground>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          <Text style={styles.welcome}>Olá, {user?.name || 'Cliente'}</Text>
        </View>

        {highlights.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isFavorite={favorites.includes(vehicle.id)}
            onFavorite={() => toggleFavorite(vehicle.id)}
            onPress={() => navigation.navigate('Detalhes', { vehicleId: vehicle.id })}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 30 },
  hero: { minHeight: 330, borderRadius: 24, overflow: 'hidden', marginBottom: 26 },
  heroImage: { borderRadius: 24 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', padding: 22, justifyContent: 'flex-end' },
  logo: { color: colors.primary, fontSize: 20, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  title: { color: colors.text, fontSize: 32, fontWeight: '900', lineHeight: 38 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 18 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  welcome: { color: colors.muted, marginTop: 4 }
});
