import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';
import PrimaryButton from './PrimaryButton';

export default function VehicleCard({ vehicle, onPress, onFavorite, isFavorite }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {vehicle.image ? (
        <Image source={{ uri: vehicle.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.emptyImage]}>
          <Text style={styles.emptyImageText}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{vehicle.name}</Text>
          <Pressable onPress={onFavorite} style={styles.favoriteButton}>
            <Text style={styles.favoriteText}>{isFavorite ? '★' : '☆'}</Text>
          </Pressable>
        </View>

        <Text style={styles.meta}>
          {vehicle.year} • {vehicle.km.toLocaleString('pt-BR')} km • {vehicle.transmission}
        </Text>

        <Text style={styles.price}>{formatCurrency(vehicle.price)}</Text>

        <PrimaryButton title="Ver detalhes" onPress={onPress} style={styles.button} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border
  },
  image: {
    width: '100%',
    height: 190
  },
  emptyImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  emptyImageText: {
    color: colors.muted,
    fontWeight: '700'
  },
  content: {
    padding: 14
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  favoriteButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteText: {
    color: colors.primary,
    fontSize: 30
  },
  meta: {
    color: colors.muted,
    marginTop: 6
  },
  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 12
  },
  button: {
    marginTop: 4
  }
});