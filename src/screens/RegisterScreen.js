import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

export default function RegisterScreen({ setUser }) {
  const [name, setName] = useState('Luis Eduardo');
  const [email, setEmail] = useState('cliente@jlpg.com');
  const [phone, setPhone] = useState('(54) 99999-9999');
  const [password, setPassword] = useState('123456');

  function handleRegister() {
    if (typeof setUser !== 'function') {
      Alert.alert('Erro', 'Função de cadastro não foi carregada. Reinicie o aplicativo.');
      return;
    }

    setUser({ name, email, phone, role: 'CLIENT' });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar cadastro</Text>
        <Text style={styles.description}>Preencha seus dados para acompanhar propostas e histórico de compras.</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={name} onChangeText={setName} placeholderTextColor={colors.muted} style={styles.input} />
        <Text style={styles.label}>E-mail</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={colors.muted} style={styles.input} />
        <Text style={styles.label}>Telefone</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={colors.muted} style={styles.input} />
        <Text style={styles.label}>Senha</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.muted} style={styles.input} />
        <PrimaryButton title="Finalizar cadastro" onPress={handleRegister} style={styles.button} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 20 },
  description: { color: colors.muted, lineHeight: 22, marginTop: 8, marginBottom: 24 },
  label: { color: colors.text, fontWeight: '700', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.input, color: colors.text, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: colors.border },
  button: { marginTop: 24 }
});
