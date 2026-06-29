import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const FIELDS = [
  { key: 'name', label: 'Nome do veículo', icon: 'car-outline', placeholder: 'Ex: BMW 320i M Sport', required: true },
  { key: 'brand', label: 'Marca', icon: 'business-outline', placeholder: 'Ex: BMW', required: true },
  { key: 'model', label: 'Modelo', icon: 'layers-outline', placeholder: 'Ex: 320i M Sport', required: true },
  { key: 'year', label: 'Ano', icon: 'calendar-outline', placeholder: 'Ex: 2023', numeric: true, required: true },
  { key: 'price', label: 'Preço (R$)', icon: 'cash-outline', placeholder: 'Ex: 189900', numeric: true, required: true },
  { key: 'km', label: 'Quilometragem', icon: 'speedometer-outline', placeholder: 'Ex: 42000', numeric: true, required: true },
  { key: 'transmission', label: 'Câmbio', icon: 'git-branch-outline', placeholder: 'Automático / Manual / CVT' },
  { key: 'fuel', label: 'Combustível', icon: 'flame-outline', placeholder: 'Gasolina / Flex / Diesel' },
  { key: 'category', label: 'Categoria', icon: 'pricetag-outline', placeholder: 'Sedan / SUV / Picape...' },
  { key: 'color', label: 'Cor', icon: 'color-palette-outline', placeholder: 'Ex: Preto Safira' },
  { key: 'stock', label: 'Estoque', icon: 'cube-outline', placeholder: 'Ex: 1', numeric: true },
  { key: 'description', label: 'Descrição', icon: 'document-text-outline', placeholder: 'Descreva o veículo...', multiline: true },
];

export default function VehicleFormScreen({ route, navigation, vehicles, saveVehicle }) {
  const editingVehicle = vehicles.find((item) => item.id === route.params?.vehicleId);
  const isEditing = !!editingVehicle;

  const [form, setForm] = useState(
    editingVehicle
      ? { ...editingVehicle, year: String(editingVehicle.year), price: String(editingVehicle.price), km: String(editingVehicle.km), stock: String(editingVehicle.stock) }
      : { name: '', brand: '', model: '', year: '2024', price: '', km: '0', transmission: 'Automático', fuel: 'Flex', category: 'Sedan', color: '', stock: '1', image: '', description: '' }
  );
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  }

  async function pickImage() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert('Permissão necessária', 'Permita o acesso à galeria para escolher uma imagem.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [16, 9], quality: 0.8,
    });
    if (!result.canceled) update('image', result.assets[0].uri);
  }

  function validate() {
    const newErrors = {};
    FIELDS.filter((f) => f.required).forEach(({ key, label }) => {
      if (!form[key]?.trim()) newErrors[key] = `${label} é obrigatório`;
    });
    if (form.price && isNaN(Number(form.price))) newErrors.price = 'Preço inválido';
    if (form.year && (isNaN(Number(form.year)) || Number(form.year) < 1900)) newErrors.year = 'Ano inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) { Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.'); return; }
    saveVehicle({ ...form, id: editingVehicle?.id, year: Number(form.year), price: Number(form.price), km: Number(form.km), stock: Number(form.stock) });
    navigation.goBack();
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.headerArea}>
          <View style={styles.headerIcon}>
            <Ionicons name={isEditing ? 'pencil' : 'add-circle'} size={26} color={colors.primary} />
          </View>
          <Text style={styles.title}>{isEditing ? 'Editar veículo' : 'Cadastrar veículo'}</Text>
          <Text style={styles.subtitle}>Preencha as informações do veículo abaixo.</Text>
        </View>

        {/* Imagem */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionLabel}>Imagem do veículo</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {form.image ? (
              <>
                <Image source={{ uri: form.image }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={22} color="#fff" />
                  <Text style={styles.imageOverlayText}>Trocar imagem</Text>
                </View>
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={36} color={colors.muted} />
                <Text style={styles.imagePlaceholderText}>Toque para adicionar imagem</Text>
                <Text style={styles.imagePlaceholderSub}>Proporção 16:9 recomendada</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <View style={styles.fieldsCard}>
          <Text style={styles.sectionLabel}>Informações do veículo</Text>
          {FIELDS.map(({ key, label, icon, placeholder, numeric, multiline, required }) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>
                {label} {required && <Text style={styles.required}>*</Text>}
              </Text>
              <View style={[styles.inputRow, errors[key] && styles.inputError, multiline && styles.inputMultiline]}>
                <Ionicons name={icon} size={16} color={errors[key] ? colors.danger : colors.muted} style={styles.fieldIcon} />
                <TextInput
                  value={String(form[key] ?? '')}
                  onChangeText={(v) => update(key, v)}
                  placeholder={placeholder}
                  placeholderTextColor={colors.muted}
                  keyboardType={numeric ? 'numeric' : 'default'}
                  multiline={multiline}
                  numberOfLines={multiline ? 4 : 1}
                  style={[styles.input, multiline && styles.inputArea]}
                />
              </View>
              {errors[key] && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={13} color={colors.danger} />
                  <Text style={styles.errorText}>{errors[key]}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <PrimaryButton title={isEditing ? 'Salvar alterações' : 'Cadastrar veículo'} onPress={handleSave} style={styles.saveBtn} />
        <PrimaryButton title="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  headerArea: { alignItems: 'center', marginBottom: 22, marginTop: 8 },
  headerIcon: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1.5, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
  imageSection: { marginBottom: 18 },
  sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  imageBox: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  previewImage: { width: '100%', height: 200 },
  imageOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  imageOverlayText: { color: '#fff', fontWeight: '700' },
  imagePlaceholder: {
    height: 160, backgroundColor: colors.input,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  imagePlaceholderText: { color: colors.muted, fontWeight: '700' },
  imagePlaceholderSub: { color: colors.muted, fontSize: 12 },
  fieldsCard: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: { color: colors.textSecondary, fontWeight: '700', marginBottom: 7, fontSize: 13 },
  required: { color: colors.danger },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
  },
  inputMultiline: { alignItems: 'flex-start' },
  fieldIcon: { paddingLeft: 12, paddingTop: 2 },
  input: { flex: 1, color: colors.text, paddingHorizontal: 10, paddingVertical: 12, fontSize: 14 },
  inputArea: { minHeight: 90, textAlignVertical: 'top', paddingTop: 12 },
  inputError: { borderColor: colors.danger },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  errorText: { color: colors.danger, fontSize: 12 },
  saveBtn: { marginBottom: 10 },
});
