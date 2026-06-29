import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors } from '../theme/colors';

const AUTO_REPLIES = [
  'Olá! Obrigado por entrar em contato com a JLPG Motors. Como posso ajudar?',
  'Claro! Posso te passar mais informações sobre esse veículo. Qual é sua dúvida?',
  'Ótima escolha! Esse modelo tem excelente histórico de manutenção.',
  'Podemos agendar um test drive para você conhecer pessoalmente. Qual data te agrada?',
  'Temos condições especiais de financiamento com taxa a partir de 0,99% a.m.',
  'Vou verificar com nossa equipe e te retorno em breve!',
  'Conseguimos trabalhar com entrada + parcelas. Posso preparar uma simulação?',
  'Aceitamos troca de veículo como parte do pagamento. Me conta o que você tem!',
];

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatScreen({ route, navigation, user, colors: themeColors }) {
  const colors = themeColors || darkColors;
  const vehicle = route?.params?.vehicle;
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: vehicle
        ? `Olá! Tenho interesse no ${vehicle.name}. Pode me passar mais informações?`
        : 'Olá! Gostaria de saber mais sobre os veículos disponíveis.',
      sender: 'user', time: new Date(Date.now() - 60000), status: 'read',
    },
    {
      id: '2',
      text: 'Olá! Seja bem-vindo à JLPG Motors! Fico feliz em ajudar. O que gostaria de saber?',
      sender: 'agent', time: new Date(Date.now() - 50000),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const replyIndex = useRef(1);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: String(Date.now()), text, sender: 'user', time: new Date(), status: 'sent' };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((m) => m.map((msg) => msg.id === userMsg.id ? { ...msg, status: 'read' } : msg));
    }, 800);
    setTimeout(() => {
      setIsTyping(false);
      const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
      replyIndex.current++;
      setMessages((m) => [...m, { id: String(Date.now() + 1), text: reply, sender: 'agent', time: new Date() }]);
    }, 1800);
  }

  const QUICK_MSGS = ['Quero agendar test drive', 'Como funciona o financiamento?', 'Aceita troca?', 'Qual o valor de entrada?'];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header com botão voltar */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.agentAvatar, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}>
          <Ionicons name="person" size={20} color={colors.primary} />
        </View>
        <View style={styles.agentInfo}>
          <Text style={[styles.agentName, { color: colors.text }]}>JLPG Motors</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={[styles.onlineText, { color: colors.success }]}>Online agora</Text>
          </View>
        </View>
        <TouchableOpacity accessibilityLabel="Ligar">
          <Ionicons name="call-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {vehicle && (
        <View style={[styles.vehicleBanner, { backgroundColor: `${colors.primary}08`, borderBottomColor: `${colors.primary}25` }]}>
          <Ionicons name="car-outline" size={15} color={colors.primary} />
          <Text style={[styles.vehicleBannerText, { color: colors.muted }]} numberOfLines={1}>
            Sobre: <Text style={[styles.vehicleBannerName, { color: colors.primary }]}>{vehicle.name}</Text>
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.msgWrapper, item.sender === 'user' ? styles.msgWrapperUser : styles.msgWrapperAgent]}>
            {item.sender === 'agent' && (
              <View style={[styles.agentAvatarSmall, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}>
                <Ionicons name="person" size={14} color={colors.primary} />
              </View>
            )}
            <View style={[
              styles.bubble,
              item.sender === 'user'
                ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
                : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 }
            ]}>
              <Text style={[styles.bubbleText, { color: item.sender === 'user' ? colors.background : colors.text }]}>
                {item.text}
              </Text>
              <View style={styles.bubbleMeta}>
                <Text style={[styles.bubbleTime, { color: item.sender === 'user' ? `${colors.background}80` : colors.muted }]}>
                  {formatTime(item.time)}
                </Text>
                {item.sender === 'user' && (
                  <Ionicons name={item.status === 'read' ? 'checkmark-done' : 'checkmark'} size={12}
                    color={item.status === 'read' ? colors.info : `${colors.background}60`} />
                )}
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={isTyping ? (
          <View style={[styles.typingWrapper]}>
            <View style={[styles.agentAvatarSmall, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}>
              <Ionicons name="person" size={14} color={colors.primary} />
            </View>
            <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.typingDot, { backgroundColor: colors.muted }]} />
              <View style={[styles.typingDot, styles.typingDotMid, { backgroundColor: colors.muted }]} />
              <View style={[styles.typingDot, { backgroundColor: colors.muted }]} />
            </View>
          </View>
        ) : null}
      />

      <View style={[styles.quickRow, { borderTopColor: colors.border }]}>
        {QUICK_MSGS.map((msg) => (
          <TouchableOpacity key={msg} style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setInput(msg)}>
            <Text style={[styles.quickChipText, { color: colors.muted }]}>{msg}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={colors.muted}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          multiline maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: input.trim() ? colors.primary : colors.card }]}
          onPress={sendMessage}
          disabled={!input.trim()}
          accessibilityLabel="Enviar mensagem"
        >
          <Ionicons name="send" size={18} color={input.trim() ? colors.background : colors.muted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, paddingTop: 52, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  agentAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  agentInfo: { flex: 1 },
  agentName: { fontWeight: '900', fontSize: 15 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#3DDC84' },
  onlineText: { fontSize: 12, fontWeight: '600' },
  vehicleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 9 },
  vehicleBannerText: { fontSize: 13, flex: 1 },
  vehicleBannerName: { fontWeight: '800' },
  messagesList: { padding: 16, gap: 10, paddingBottom: 8 },
  msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgWrapperUser: { justifyContent: 'flex-end' },
  msgWrapperAgent: { justifyContent: 'flex-start' },
  agentAvatarSmall: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' },
  bubbleTime: { fontSize: 10 },
  typingWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingTop: 4, paddingHorizontal: 16 },
  typingBubble: { flexDirection: 'row', gap: 4, borderWidth: 1, borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 14 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5 },
  typingDotMid: { marginTop: -4 },
  quickRow: { flexDirection: 'row', gap: 8, padding: 10, flexWrap: 'wrap', borderTopWidth: 1 },
  quickChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  quickChipText: { fontSize: 12, fontWeight: '600' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
