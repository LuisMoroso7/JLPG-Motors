import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation, setUser }) {
  const [email, setEmail] = useState('cliente@jlpg.com');
  const [password, setPassword] = useState('123456');

  function handleLogin() {
    if (typeof setUser !== 'function') {
      Alert.alert('Erro', 'Função de login não foi carregada. Reinicie o aplicativo.');
      return;
    }

    const admin = email.toLowerCase().includes('admin');
    setUser({
      name: admin ? 'Administrador JLPG' : 'Cliente JLPG',
      email,
      role: admin ? 'ADMIN' : 'CLIENT'
    });
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.logo}>JLPG</Text>
        <Text style={styles.subtitle}>Motors</Text>
        <Text style={styles.description}>Acesse sua conta para visualizar veículos, salvar favoritos e acompanhar propostas.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="seu@email.com" placeholderTextColor={colors.muted} style={styles.input} />
          <Text style={styles.label}>Senha</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Sua senha" placeholderTextColor={colors.muted} style={styles.input} />
          <PrimaryButton title="Entrar" onPress={handleLogin} style={styles.button} />
          <PrimaryButton title="Criar cadastro" variant="outline" onPress={() => navigation.navigate('Cadastro')} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { color: colors.primary, fontSize: 58, fontWeight: '900', textAlign: 'center', letterSpacing: 4 },
  subtitle: { color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', marginBottom: 16 },
  description: { color: colors.muted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  form: { backgroundColor: colors.surface, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.text, fontWeight: '700', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: colors.input, color: colors.text, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: colors.border },
  button: { marginTop: 18, marginBottom: 12 },
  hint: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 14 }
});
