import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const SYSTEM_PROMPT = `Você é o João, dono e vendedor da JLPG Motors, uma loja de veículos localizada em Ciriaco, RS. 
Você é simpático, direto, conhece muito de carros e motos e quer ajudar o cliente a encontrar o veículo ideal.
Responda sempre em português brasileiro, de forma amigável e profissional.
Quando o cliente perguntar sobre preços ou condições, mencione que vocês têm ótimas condições de financiamento e aceitam troca.
Não invente especificações técnicas - fale de forma geral e convide para um test drive.
Mantenha respostas curtas (máximo 3 frases) para parecer uma conversa de WhatsApp.
Se perguntarem sobre agendamento, diga que podem usar o botão "Agendar Test Drive" no app.`;

export default function ChatScreen({ route, navigation, user, vehicles = []}) {
  const vehicle = route?.params?.vehicle;

  const initialMsg = vehicle
    ? `Olá! Tenho interesse no ${vehicle.name}. Pode me passar mais informações?`
    : 'Olá! Gostaria de saber mais sobre os veículos disponíveis.';

  const [messages, setMessages] = useState([
    { id: '1', text: initialMsg, sender: 'user', time: new Date(Date.now() - 30000), status: 'read' },
    { id: '2', text: `Olá! Eu sou o João, da JLPG Motors! ${vehicle ? `O ${vehicle.name} é uma excelente escolha! ` : ''}Como posso te ajudar hoje?`, sender: 'agent', time: new Date(Date.now() - 20000) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: String(Date.now()), text, sender: 'user', time: new Date(), status: 'sent' };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Monta histórico para a API
      const history = newMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT + (vehicle ? `\n\nO cliente está perguntando sobre: ${vehicle.name} (${vehicle.year}, ${vehicle.km?.toLocaleString('pt-BR')} km, R$ ${vehicle.price?.toLocaleString('pt-BR')}).` : ''),
          messages: history,
        }),
      });

      const data = await response.json();
      const reply = data?.content?.[0]?.text || 'Desculpe, não consegui responder agora. Tente novamente!';

      setMessages((m) => m.map((msg) => msg.id === userMsg.id ? { ...msg, status: 'read' } : msg));
      setMessages((m) => [...m, { id: String(Date.now() + 1), text: reply, sender: 'agent', time: new Date() }]);
    } catch (e) {
      setMessages((m) => [...m, {
        id: String(Date.now() + 1),
        text: 'Opa, tive um problema técnico aqui! Me chama no WhatsApp: (54) 99999-0000 😊',
        sender: 'agent',
        time: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  const QUICK_MSGS = ['Quero agendar test drive', 'Como funciona o financiamento?', 'Aceita troca?', 'Qual o valor de entrada?'];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.agentAvatar, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}>
          <Text style={[styles.agentAvatarText, { color: colors.primary }]}>JP</Text>
        </View>
        <View style={styles.agentInfo}>
          <Text style={[styles.agentName, { color: colors.text }]}>João — JLPG Motors</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={[styles.onlineText, { color: colors.success }]}>Dono da loja • Online</Text>
          </View>
        </View>
        <View style={[styles.aiBadge, { backgroundColor: `${colors.info}18`, borderColor: `${colors.info}40` }]}>
          <Ionicons name="sparkles" size={11} color={colors.info} />
          <Text style={[styles.aiBadgeText, { color: colors.info }]}>IA</Text>
        </View>
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.msgWrapper, item.sender === 'user' ? styles.msgWrapperUser : styles.msgWrapperAgent]}>
            {item.sender === 'agent' && (
              <View style={[styles.agentAvatarSmall, { backgroundColor: `${colors.primary}18`, borderColor: colors.primary }]}>
                <Text style={[styles.agentAvatarSmallText, { color: colors.primary }]}>JP</Text>
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
                <Text style={[styles.bubbleTime, { color: item.sender === 'user' ? `${colors.background}70` : colors.muted }]}>
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
              <Text style={[styles.agentAvatarSmallText, { color: colors.primary }]}>JP</Text>
            </View>
            <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.typingText, { color: colors.muted }]}>João está digitando...</Text>
            </View>
          </View>
        ) : null}
      />

      <View style={[styles.quickRow, { borderTopColor: `${colors.border}50` }]}>
        {QUICK_MSGS.map((msg) => (
          <TouchableOpacity key={msg}
            style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setInput(msg)}
          >
            <Text style={[styles.quickChipText, { color: colors.muted }]}>{msg}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Fale com o João..."
          placeholderTextColor={colors.muted}
          style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          multiline maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: input.trim() && !isTyping ? colors.primary : colors.card }]}
          onPress={sendMessage}
          disabled={!input.trim() || isTyping}
          accessibilityLabel="Enviar mensagem"
        >
          {isTyping
            ? <ActivityIndicator size="small" color={colors.muted} />
            : <Ionicons name="send" size={18} color={input.trim() ? colors.background : colors.muted} />
          }
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
  agentAvatarText: { fontWeight: '900', fontSize: 14 },
  agentInfo: { flex: 1 },
  agentName: { fontWeight: '900', fontSize: 15 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#3DDC84' },
  onlineText: { fontSize: 11, fontWeight: '600' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderWidth: 1, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  aiBadgeText: { fontSize: 10, fontWeight: '800' },
  vehicleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 9 },
  vehicleBannerText: { fontSize: 13, flex: 1 },
  vehicleBannerName: { fontWeight: '800' },
  messagesList: { padding: 16, gap: 10, paddingBottom: 8 },
  msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgWrapperUser: { justifyContent: 'flex-end' },
  msgWrapperAgent: { justifyContent: 'flex-start' },
  agentAvatarSmall: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  agentAvatarSmallText: { fontWeight: '900', fontSize: 10 },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' },
  bubbleTime: { fontSize: 10 },
  typingWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingTop: 4, paddingHorizontal: 16, paddingBottom: 4 },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  typingText: { fontSize: 13 },
  quickRow: { flexDirection: 'row', gap: 8, padding: 8, flexWrap: 'wrap', borderTopWidth: 1 },
  quickChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  quickChipText: { fontSize: 12, fontWeight: '600' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
