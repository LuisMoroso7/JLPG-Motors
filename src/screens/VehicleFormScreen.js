import React, { useState } from 'react';
import {
  Alert, Image, Modal, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const TRANSMISSIONS = ['Manual', 'Automatico', 'Automatico CVT', 'Automatico DSG', 'Automatico S-tronic', 'Automatico PDK', 'Automatico DCT'];
const FUELS = ['Flex', 'Gasolina', 'Diesel', 'Eletrico', 'Hibrido'];
const CATEGORIES = ['Hatch Popular', 'Sedan Popular', 'Sedan', 'Sedan Premium', 'SUV', 'SUV Premium', 'Picape', 'Hatch Premium', 'Eletrico', 'Esportivo', 'Esportivo Premium', 'Moto'];
const COLORS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Laranja', 'Bege', 'Marrom', 'Vinho', 'Dourado', 'Branco Perola', 'Preto Safira', 'Cinza Grafite'];
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
  const editingVehicle = vehicles?.find((vehicle) => vehicle.id === route.params?.vehicleId);
  const isEditing = !!editingVehicle;

  const [form, setForm] = useState(editingVehicle ? {
    ...editingVehicle,
    year: String(editingVehicle.year),
    price: String(editingVehicle.price),
    km: String(editingVehicle.km),
    stock: String(editingVehicle.stock),
  } : {
    name: '',
    brand: '',
    model: '',
    year: String(CURRENT_YEAR),
    price: '',
    km: '0',
    transmission: 'Automatico',
    fuel: 'Flex',
    category: 'Sedan',
    color: 'Branco',
    stock: '1',
    image: '',
    description: '',
    plate: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: null }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = 'Nome e obrigatorio';
    if (!form.brand?.trim()) newErrors.brand = 'Marca e obrigatoria';
    if (!form.model?.trim()) newErrors.model = 'Modelo e obrigatorio';
    if (!form.price || isNaN(Number(form.price))) newErrors.price = 'Preco invalido';
    if (!form.plate?.trim()) newErrors.plate = 'Placa e obrigatoria';
    if (form.image?.trim() && !/^https?:\/\//i.test(form.image.trim())) {
      newErrors.image = 'Use uma URL publica iniciando com http:// ou https://';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) {
      Alert.alert('Campos obrigatorios', 'Preencha todos os campos destacados.');
      return;
    }

    setSaving(true);
    try {
      await saveVehicle({
        ...form,
        id: editingVehicle?.id,
        image: form.image?.trim() || '',
        year: Number(form.year),
        price: Number(form.price),
        km: Number(form.km),
        stock: Number(form.stock),
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message || 'Nao foi possivel salvar o veiculo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.headerArea}>
          <View style={styles.headerIcon}>
            <Ionicons name={isEditing ? 'pencil' : 'add-circle'} size={26} color={colors.primary} />
          </View>
          <Text style={styles.title}>{isEditing ? 'Editar veiculo' : 'Cadastrar veiculo'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Foto do veiculo</Text>
          <View style={styles.imageBox}>
            {form.image ? (
              <Image source={{ uri: form.image }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={36} color={colors.muted} />
                <Text style={styles.imagePlaceholderText}>Informe uma URL publica da foto</Text>
              </View>
            )}
          </View>
          <View style={[styles.inputRow, errors.image && styles.inputError, styles.imageUrlInput]}>
            <Ionicons name="link-outline" size={16} color={colors.muted} style={styles.inputIcon} />
            <TextInput
              value={form.image}
              onChangeText={(value) => update('image', value)}
              placeholder="https://exemplo.com/veiculo.jpg"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="url"
              style={[styles.input, { color: colors.text }]}
            />
          </View>
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informacoes basicas</Text>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Nome do veiculo *</Text>
              <View style={[styles.inputRow, errors.name && styles.inputError]}>
                <Ionicons name="car-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.name}
                  onChangeText={(value) => update('name', value)}
                  placeholder="Ex: BMW 320i M Sport"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Marca *</Text>
              <View style={[styles.inputRow, errors.brand && styles.inputError]}>
                <Ionicons name="business-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.brand}
                  onChangeText={(value) => update('brand', value)}
                  placeholder="Ex: BMW"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Modelo *</Text>
              <View style={[styles.inputRow, errors.model && styles.inputError]}>
                <Ionicons name="layers-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.model}
                  onChangeText={(value) => update('model', value)}
                  placeholder="Ex: 320i M Sport"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Preco (R$) *</Text>
              <View style={[styles.inputRow, errors.price && styles.inputError]}>
                <Ionicons name="cash-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.price}
                  onChangeText={(value) => update('price', value)}
                  placeholder="Ex: 189900"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Quilometragem</Text>
              <View style={styles.inputRow}>
                <Ionicons name="speedometer-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.km}
                  onChangeText={(value) => update('km', value)}
                  placeholder="Ex: 42000"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Placa *</Text>
              <View style={[styles.inputRow, errors.plate && styles.inputError]}>
                <Ionicons name="card-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.plate}
                  onChangeText={(value) => update('plate', value.toUpperCase())}
                  placeholder="Ex: ABC1D23"
                  placeholderTextColor={colors.muted}
                  autoCapitalize="characters"
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
              {errors.plate && <Text style={styles.errorText}>{errors.plate}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Estoque</Text>
              <View style={styles.inputRow}>
                <Ionicons name="cube-outline" size={16} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={form.stock}
                  onChangeText={(value) => update('stock', value)}
                  placeholder="Ex: 1"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  style={[styles.input, { color: colors.text }]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Especificacoes</Text>
          <View style={styles.card}>
            <SelectField label="Ano" value={form.year} options={YEARS} onSelect={(value) => update('year', value)} icon="calendar-outline" />
            <SelectField label="Cambio" value={form.transmission} options={TRANSMISSIONS} onSelect={(value) => update('transmission', value)} icon="git-branch-outline" />
            <SelectField label="Combustivel" value={form.fuel} options={FUELS} onSelect={(value) => update('fuel', value)} icon="flame-outline" />
            <SelectField label="Categoria" value={form.category} options={CATEGORIES} onSelect={(value) => update('category', value)} icon="pricetag-outline" />
            <SelectField label="Cor" value={form.color} options={COLORS} onSelect={(value) => update('color', value)} icon="color-palette-outline" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Descricao</Text>
          <View style={styles.card}>
            <TextInput
              value={form.description}
              onChangeText={(value) => update('description', value)}
              placeholder="Descreva o veiculo..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              style={[styles.descInput, { color: colors.text }]}
            />
          </View>
        </View>

        <PrimaryButton
          title={isEditing ? 'Salvar alteracoes' : 'Cadastrar veiculo'}
          onPress={handleSave}
          style={styles.saveBtn}
          loading={saving}
          disabled={saving}
        />
        <PrimaryButton title="Cancelar" variant="ghost" onPress={() => navigation.goBack()} disabled={saving} />
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
  imagePlaceholder: { height: 160, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imagePlaceholderText: { color: colors.muted, fontWeight: '700' },
  imageUrlInput: { marginTop: 10 },
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
