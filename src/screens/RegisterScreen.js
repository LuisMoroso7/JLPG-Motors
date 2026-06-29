import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function RegisterScreen({ navigation, setUser, handleRegister }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: null }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 3) newErrors.name = 'Nome deve ter ao menos 3 caracteres';
    if (!form.email.trim()) newErrors.email = 'E-mail e obrigatorio';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'E-mail invalido';
    if (!form.phone.trim()) newErrors.phone = 'Telefone e obrigatorio';
    if (!form.password) newErrors.password = 'Senha e obrigatoria';
    else if (form.password.length < 6) newErrors.password = 'Minimo 6 caracteres';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Senhas nao coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);

    try {
      const userData = await handleRegister({
        username: form.name.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      setUser({ ...userData, phone: form.phone.trim() });
    } catch (e) {
      Alert.alert('Erro no cadastro', e.message || 'Nao foi possivel criar sua conta.');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: 'name', label: 'Nome completo', icon: 'person-outline', placeholder: 'Seu nome', keyboard: 'default' },
    { key: 'email', label: 'E-mail', icon: 'mail-outline', placeholder: 'seu@email.com', keyboard: 'email-address' },
    { key: 'phone', label: 'Telefone', icon: 'call-outline', placeholder: '(00) 00000-0000', keyboard: 'phone-pad' },
    { key: 'password', label: 'Senha', icon: 'lock-closed-outline', placeholder: 'Minimo 6 caracteres', secure: true },
    { key: 'confirmPassword', label: 'Confirmar senha', icon: 'shield-checkmark-outline', placeholder: 'Repita a senha', secure: true },
  ];

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={28} color={colors.primary} />
            </View>
            <Text style={styles.title}>Criar cadastro</Text>
            <Text style={styles.subtitle}>Preencha seus dados para acompanhar propostas e historico de compras.</Text>
          </View>

          <View style={styles.card}>
            {fields.map(({ key, label, icon, placeholder, keyboard, secure }) => (
              <View key={key} style={styles.field}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputRow, errors[key] && styles.inputError]}>
                  <Ionicons name={icon} size={18} color={colors.muted} style={styles.inputIcon} />
                  <TextInput
                    value={form[key]}
                    onChangeText={(value) => update(key, value)}
                    placeholder={placeholder}
                    placeholderTextColor={colors.muted}
                    keyboardType={keyboard || 'default'}
                    autoCapitalize={key === 'name' ? 'words' : 'none'}
                    secureTextEntry={secure && !showPassword}
                    style={styles.input}
                  />
                  {secure && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} />
                    </TouchableOpacity>
                  )}
                </View>
                {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
              </View>
            ))}

            <PrimaryButton title="Finalizar cadastro" onPress={handleSubmit} style={styles.btn} loading={loading} />
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Ionicons name="arrow-back" size={16} color={colors.muted} />
            <Text style={styles.backText}>Ja tenho uma conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginTop: 6, fontSize: 13 },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: colors.border },
  field: { marginBottom: 14 },
  label: { color: colors.textSecondary, fontWeight: '700', marginBottom: 7, fontSize: 13 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, color: colors.text, paddingHorizontal: 12, paddingVertical: 13, fontSize: 14 },
  inputError: { borderColor: colors.danger },
  eyeBtn: { paddingRight: 14 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 4, marginLeft: 4 },
  btn: { marginTop: 8 },
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 },
  backText: { color: colors.muted, fontSize: 13 },
});
