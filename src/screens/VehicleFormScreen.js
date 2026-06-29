import React, { useState } from 'react';
import {
  Alert, Modal, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const TRANSMISSIONS = ['Manual', 'Automático', 'Automático CVT', 'Automático DSG', 'Automático S-tronic', 'Automático PDK', 'Automático DCT'];
const FUELS = ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido'];
const CATEGORIES = ['Hatch Popular', 'Sedan Popular', 'Sedan', 'Sedan Premium', 'SUV', 'SUV Premium', 'Picape', 'Hatch Premium', 'Elétrico', 'Esportivo', 'Esportivo Premium', 'Moto'];
const COLORS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Laranja', 'Bege', 'Marrom', 'Vinho', 'Dourado', 'Branco Pérola', 'Preto Safira', 'Cinza Grafite'];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

function SelectField({ label, value, options, onSelect, icon }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selectRow}
        onPress={() => setVisible(true)}
      >
        <Ionicons name={icon || 'chevron-down'} size={16} color={colors.muted} style={styles.inputIcon} />
        <Text style={[styles.selectText, !value && { color: colors.muted }]}>
          {value || `Selecione ${label.toLowerCase()}`}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.muted} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionItem, value === opt && styles.optionItemActive]}
                  onPress={() => { onSelect(opt); setVisible(false); }}
                >
                  <Text style={[styles.optionText, value === opt && styles.optionTextActive]}>{opt}</Text>
                  {value === opt && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function VehicleFormScreen({ route, navigation, vehicles, saveVehicle }) {
  const editingVehicle = vehicles?.find((v) => v.id === route.params?.vehicleId);
  const isEditing = !!editingVehicle;

  const [form, setForm] = useState(editingVehicle ? {
    ...editingVehicle,
    year: String(editingVehicle.year),
    price: String(editingVehicle.price),
    km: String(editingVehicle.km),
    stock: String(editingVehicle.stock),
  } : {
    name: '', brand: '', model: '', year: String(CURRENT_YEAR),
    price: '', km: '0', transmission: 'Automático', fuel: 'Flex',
    category: 'Sedan', color: 'Branco', stock: '1',
    image: '', description: '', plate: '',
  });

  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  }

  async function pickImage() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert('Permissão necessária'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [16, 9], quality: 0.8,
    });
    if (!result.canceled) update('image', result.assets[0].uri);
  }

  function validate() {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Nome é obrigatório';
    if (!form.brand?.trim()) newErrors.brand = 'Marca é obrigatória';
    if (!form.price || isNaN(Number(form.price))) newErrors.price = 'Preço inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) { Alert.alert('Campos obrigatórios', 'Preencha todos os campos.'); return; }
    saveVehicle({
      ...form,
      id: editingVehicle?.id,
      year: Number(form.year),
      price: Number(form.price),
      km: Number(form.km),
      stock: Number(form.stock),
    });
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
        </View>

        {/* Imagem */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Foto do veículo</Text>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {form.image ? (
              <>
                <Image source={{ uri: form.image }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={22} color="#fff" />
                  <Text style={styles.imageOverlayText}>Trocar foto</Text>
                </View>
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={36} color={colors.muted} />
                <Text style={styles.imagePlaceholderText}>Toque para adicionar foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Campos de texto */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informações básicas</Text>
          <View style={styles.card}>

            {/* Nome */}
            <View style={styles.field}>
              <Text style={styles.label}>Nome do veículo *</Text>
              <View style={[styles.inputRow, errors.name && styles.inputError]}>
                <Ionicons name="car-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.name} onChangeText={(v) => update('name', v)}
                  placeholder="Ex: BMW 320i M Sport" placeholderTextColor={colors.muted}
                  style={[styles.input, { color: colors.text }]} />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Marca */}
            <View style={styles.field}>
              <Text style={styles.label}>Marca *</Text>
              <View style={[styles.inputRow, errors.brand && styles.inputError]}>
                <Ionicons name="business-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.brand} onChangeText={(v) => update('brand', v)}
                  placeholder="Ex: BMW" placeholderTextColor={colors.muted}
                  style={[styles.input, { color: colors.text }]} />
              </View>
              {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>

            {/* Modelo */}
            <View style={styles.field}>
              <Text style={styles.label}>Modelo</Text>
              <View style={styles.inputRow}>
                <Ionicons name="layers-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.model} onChangeText={(v) => update('model', v)}
                  placeholder="Ex: 320i M Sport" placeholderTextColor={colors.muted}
                  style={[styles.input, { color: colors.text }]} />
              </View>
            </View>

            {/* Preço */}
            <View style={styles.field}>
              <Text style={styles.label}>Preço (R$) *</Text>
              <View style={[styles.inputRow, errors.price && styles.inputError]}>
                <Ionicons name="cash-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.price} onChangeText={(v) => update('price', v)}
                  placeholder="Ex: 189900" placeholderTextColor={colors.muted}
                  keyboardType="numeric" style={[styles.input, { color: colors.text }]} />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            {/* KM */}
            <View style={styles.field}>
              <Text style={styles.label}>Quilometragem</Text>
              <View style={styles.inputRow}>
                <Ionicons name="speedometer-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.km} onChangeText={(v) => update('km', v)}
                  placeholder="Ex: 42000" placeholderTextColor={colors.muted}
                  keyboardType="numeric" style={[styles.input, { color: colors.text }]} />
              </View>
            </View>

            {/* Placa */}
            <View style={styles.field}>
              <Text style={styles.label}>Placa</Text>
              <View style={styles.inputRow}>
                <Ionicons name="card-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.plate} onChangeText={(v) => update('plate', v.toUpperCase())}
                  placeholder="Ex: ABC1D23" placeholderTextColor={colors.muted}
                  autoCapitalize="characters" style={[styles.input, { color: colors.text }]} />
              </View>
            </View>

            {/* Estoque */}
            <View style={styles.field}>
              <Text style={styles.label}>Estoque</Text>
              <View style={styles.inputRow}>
                <Ionicons name="cube-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput value={form.stock} onChangeText={(v) => update('stock', v)}
                  placeholder="Ex: 1" placeholderTextColor={colors.muted}
                  keyboardType="numeric" style={[styles.input, { color: colors.text }]} />
              </View>
            </View>

          </View>
        </View>

        {/* Dropdowns */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Especificações</Text>
          <View style={styles.card}>
            <SelectField label="Ano" value={form.year} options={YEARS} onSelect={(v) => update('year', v)} icon="calendar-outline" />
            <SelectField label="Câmbio" value={form.transmission} options={TRANSMISSIONS} onSelect={(v) => update('transmission', v)} icon="git-branch-outline" />
            <SelectField label="Combustível" value={form.fuel} options={FUELS} onSelect={(v) => update('fuel', v)} icon="flame-outline" />
            <SelectField label="Categoria" value={form.category} options={CATEGORIES} onSelect={(v) => update('category', v)} icon="pricetag-outline" />
            <SelectField label="Cor" value={form.color} options={COLORS} onSelect={(v) => update('color', v)} icon="color-palette-outline" />
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Descrição</Text>
          <View style={styles.card}>
            <TextInput
              value={form.description}
              onChangeText={(v) => update('description', v)}
              placeholder="Descreva o veículo..."
              placeholderTextColor={colors.muted}
              multiline numberOfLines={4}
              style={[styles.descInput, { color: colors.text }]}
            />
          </View>
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
  headerIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(201,162,39,0.1)', borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { color: colors.text, fontSize: 22, fontWeight: '900' },
  section: { marginBottom: 16 },
  sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  field: { marginBottom: 14 },
  label: { color: colors.textSecondary, fontWeight: '700', marginBottom: 7, fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  inputIcon: { paddingLeft: 12 },
  input: { flex: 1, paddingHorizontal: 10, paddingVertical: 12, fontSize: 14 },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 4 },
  selectRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingRight: 14 },
  selectText: { flex: 1, paddingHorizontal: 10, paddingVertical: 14, fontSize: 14, color: colors.text },
  imageBox: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  previewImage: { width: '100%', height: 200 },
  imageOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  imageOverlayText: { color: '#fff', fontWeight: '700' },
  imagePlaceholder: { height: 160, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imagePlaceholderText: { color: colors.muted, fontWeight: '700' },
  descInput: { minHeight: 100, textAlignVertical: 'top', padding: 14, fontSize: 14 },
  saveBtn: { marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: '70%', borderTopWidth: 1, borderTopColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionItemActive: { backgroundColor: 'rgba(201,162,39,0.08)' },
  optionText: { color: colors.textSecondary, fontSize: 15 },
  optionTextActive: { color: colors.primary, fontWeight: '800' },
});
