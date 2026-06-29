import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { apiLogin } from '../services/api';

export default function LoginScreen({ navigation, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      setUser({
        id: data.id,
        name: data.username,
        email: data.email,
        role: data.role,
      });
    } catch (e) {
      const msg = e.response?.data || 'Erro ao fazer login. Verifique suas credenciais.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Usuário ou senha inválidos!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen noSafe>
      <LinearGradient colors={['#0A0A0F', '#12121A', '#0A0A0F']} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <View style={styles.logoRing}>
              <Ionicons name="car-sport" size={44} color={colors.primary} />
            </View>
            <Text style={styles.logo}>JLPG</Text>
            <Text style={styles.logoSub}>MOTORS</Text>
            <Text style={styles.tagline}>Seu próximo carro está aqui.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar na conta</Text>

            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={18} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: null })); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: null })); }}
                  secureTextEntry={!showPassword}
                  placeholder="Sua senha"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, styles.inputFlex]}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <PrimaryButton title="Entrar" onPress={handleLogin} style={styles.btn} loading={loading} />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <PrimaryButton title="Criar cadastro" variant="outline" onPress={() => navigation.navigate('Cadastro')} />
          </View>

          <Text style={styles.hint}>
            Admin: <Text style={styles.hintHighlight}>adm@jlpg.com</Text> / senha123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', paddingTop: 60 },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoRing: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(201,162,39,0.08)', marginBottom: 16 },
  logo: { color: colors.primary, fontSize: 42, fontWeight: '900', letterSpacing: 6 },
  logoSub: { color: colors.text, fontSize: 14, fontWeight: '700', letterSpacing: 8, marginTop: 2 },
  tagline: { color: colors.muted, marginTop: 10, fontSize: 14 },
  card: { backgroundColor: colors.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginBottom: 22 },
  field: { marginBottom: 16 },
  label: { color: colors.textSecondary, fontWeight: '700', marginBottom: 8, fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, color: colors.text, paddingHorizontal: 12, paddingVertical: 14, fontSize: 15 },
  inputFlex: { flex: 1 },
  inputError: { borderColor: colors.danger },
  eyeBtn: { paddingRight: 14, paddingLeft: 6 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 5, marginLeft: 4 },
  btn: { marginTop: 6, marginBottom: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.muted, fontSize: 12 },
  hint: { color: colors.muted, textAlign: 'center', marginTop: 20, fontSize: 12, lineHeight: 18 },
  hintHighlight: { color: colors.primary, fontWeight: '700' },
});
