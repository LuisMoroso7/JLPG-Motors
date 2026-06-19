import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function VehicleFormScreen({ route, navigation, vehicles, saveVehicle }) {
  const editingVehicle = vehicles.find((item) => item.id === route.params?.vehicleId);

  const [form, setForm] = useState(
    editingVehicle || {
      name: '',
      brand: '',
      model: '',
      year: '2024',
      price: '0',
      km: '0',
      transmission: 'Automático',
      fuel: 'Flex',
      category: 'Sedan',
      color: 'Preto',
      stock: '1',
      image: '',
      description: ''
    }
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Você precisa permitir acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled) {
      updateField('image', result.assets[0].uri);
    }
  }

  function handleSave() {
    saveVehicle({
      ...form,
      id: editingVehicle?.id,
      year: Number(form.year),
      price: Number(form.price),
      km: Number(form.km),
      stock: Number(form.stock),
      image: form.image || ''
    });

    navigation.goBack();
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{editingVehicle ? 'Editar veículo' : 'Cadastrar veículo'}</Text>

        {[
          ['name', 'Nome do veículo'],
          ['brand', 'Marca'],
          ['model', 'Modelo'],
          ['year', 'Ano'],
          ['price', 'Preço'],
          ['km', 'Quilometragem'],
          ['transmission', 'Câmbio'],
          ['fuel', 'Combustível'],
          ['category', 'Categoria'],
          ['color', 'Cor'],
          ['stock', 'Estoque'],
          ['description', 'Descrição']
        ].map(([field, label]) => (
          <React.Fragment key={field}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              value={String(form[field] ?? '')}
              onChangeText={(value) => updateField(field, value)}
              placeholder={label}
              placeholderTextColor={colors.muted}
              multiline={field === 'description'}
              keyboardType={['year', 'price', 'km', 'stock'].includes(field) ? 'numeric' : 'default'}
              style={[styles.input, field === 'description' && styles.textArea]}
            />
          </React.Fragment>
        ))}

        <View style={styles.imageBox}>
          <Text style={styles.label}>Imagem do veículo</Text>

          {form.image ? (
            <Image source={{ uri: form.image }} style={styles.previewImage} />
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImage}>Nenhuma imagem selecionada.</Text>
            </View>
          )}

          <PrimaryButton
            title="Escolher imagem da galeria"
            variant="outline"
            onPress={pickImage}
          />
        </View>

        <PrimaryButton title="Salvar veículo" onPress={handleSave} style={styles.button} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 30
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 18
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12
  },
  input: {
    backgroundColor: colors.input,
    color: colors.text,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.border
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top'
  },
  imageBox: {
    marginTop: 18
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  noImageBox: {
    height: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  noImage: {
    color: colors.muted,
    fontWeight: '700'
  },
  button: {
    marginTop: 24
  }
});