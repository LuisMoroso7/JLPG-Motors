import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const SYSTEM_PROMPT = `Você é um assistente de vendas da JLPG Motors, loja de veículos em Ciriaco, RS.
Responda SEMPRE em português brasileiro de forma simpática, curta e direta (máximo 2 frases).
Você pode:
- Oferecer descontos de até 5% no valor do veículo
- Informar sobre financiamento (taxa a partir de 0,99% ao mês)
- Aceitar troca de veículo como parte do pagamento
- Agendar test drive
Quando o cliente quiser fechar negócio, diga: "Ótimo! Vou encaminhar para nosso gerente finalizar a negociação."
Seja sempre positivo e profissional.`;

export default function ChatScreen({ route, navigation, user, vehicles = [] }) {
  const vehicle = route?.params?.vehicle;
  const isAdmin = user?.role === 'ADMIN';
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: vehicle
        ? `Olá! Tenho interesse no ${vehicle.name} (${formatCurrency(vehicle?.price)}). Pode me ajudar?`
        : 'Olá! Gostaria de informações sobre os veículos disponíveis.',
      sender: 'user', time: new Date(Date.now() - 30000), status: 'read',
    },
    {
      id: '2',
      text: `Olá! Seja bem-vindo à JLPG Motors! 😊 ${vehicle ? `O ${vehicle.name} é uma excelente escolha! ` : ''}Como posso ajudar?`,
      sender: 'agent', time: new Date(Date.now() - 20000), isAI: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [negotiationStatus, setNegotiationStatus] = useState('OPEN');
  const [adminMode, setAdminMode] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: String(Date.now()), text,
      sender: isAdmin ? 'admin' : 'user',
      time: new Date(), status: 'sent',
      isAdmin,
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');

    // Se admin enviou manualmente, não chama IA
    if (isAdmin) {
      setTimeout(() => {
        setMessages((m) => m.map((msg) => msg.id === userMsg.id ? { ...msg, status: 'read' } : msg));
      }, 500);
      return;
    }

    // Cliente enviou — chama IA
    setIsTyping(true);
    try {
      const history = newMessages
        .filter((m) => m.sender !== 'admin')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 150,
          system: SYSTEM_PROMPT + (vehicle
            ? `\n\nVeículo em negociação: ${vehicle.name}, Ano: ${vehicle.year}, KM: ${vehicle.km?.toLocaleString('pt-BR')}, Preço: ${formatCurrency(vehicle.price)}.`
            : ''),
          messages: history,
        }),
      });

      const data = await response.json();
      const reply = data?.content?.[0]?.text || 'Desculpe, tive um problema. Pode repetir?';

      setMessages((m) => m.map((msg) => msg.id === userMsg.id ? { ...msg, status: 'read' } : msg));
      setMessages((m) => [...m, {
        id: String(Date.now() + 1), text: reply,
        sender: 'agent', time: new Date(), isAI: true,
      }]);
    } catch (e) {
      setMessages((m) => [...m, {
        id: String(Date.now() + 1),
        text: 'Opa, tive um problema técnico! Ligue: (54) 99671-0344 📞',
        sender: 'agent', time: new Date(), isAI: false,
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleAdminAction(action) {
    Alert.alert(
      action === 'SOLD' ? '✅ Aprovar venda' : '❌ Recusar negociação',
      action === 'SOLD'
        ? 'Confirmar venda? O veículo será marcado como vendido.'
        : 'Recusar negociação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action === 'SOLD' ? 'Aprovar' : 'Recusar',
          style: action === 'SOLD' ? 'default' : 'destructive',
          onPress: () => {
            setNegotiationStatus(action);
            const msg = action === 'SOLD'
              ? '✅ Venda aprovada pelo gerente! Entraremos em contato para finalizar a documentação. Obrigado pela preferência!'
              : '❌ Infelizmente não foi possível fechar negócio desta vez. Obrigado pelo interesse na JLPG Motors!';
            setMessages((m) => [...m, {
              id: String(Date.now()), text: msg,
              sender: 'agent', time: new Date(), isAI: false,
            }]);
          },
        },
      ]
    );
  }

  const QUICK_MSGS = ['Qual o melhor preço?', 'Aceita troca?', 'Como funciona o financiamento?', 'Quero agendar test drive'];

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.agentAvatar, { backgroundColor: 'rgba(201,162,39,0.15)', borderColor: colors.primary }]}>
          <Ionicons name="car-sport" size={20} color={colors.primary} />
        </View>
        <View style={styles.agentInfo}>
          <Text style={[styles.agentName, { color: colors.text }]}>JLPG Motors</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: negotiationStatus === 'OPEN' ? colors.success : colors.muted }]} />
            <Text style={[styles.onlineText, { color: negotiationStatus === 'OPEN' ? colors.success : colors.muted }]}>
              {negotiationStatus === 'OPEN' ? 'Online' : negotiationStatus === 'SOLD' ? 'Venda concluída ✅' : 'Encerrado'}
            </Text>
          </View>
        </View>
        {isAdmin && negotiationStatus === 'OPEN' && (
          <TouchableOpacity
            style={[styles.adminToggle, { backgroundColor: adminMode ? colors.primary : colors.card, borderColor: colors.primary }]}
            onPress={() => setAdminMode(!adminMode)}
          >
            <Ionicons name="shield-checkmark" size={14} color={adminMode ? colors.background : colors.primary} />
            <Text style={[styles.adminToggleText, { color: adminMode ? colors.background : colors.primary }]}>
              {adminMode ? 'Modo Admin' : 'Observando'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Banner do veículo */}
      {vehicle && (
        <View style={[styles.vehicleBanner, { backgroundColor: 'rgba(201,162,39,0.08)', borderBottomColor: 'rgba(201,162,39,0.2)' }]}>
          <Ionicons name="car-outline" size={14} color={colors.primary} />
          <Text style={[styles.vehicleBannerText, { color: colors.muted }]} numberOfLines={1}>
            <Text style={{ color: colors.primary, fontWeight: '800' }}>{vehicle.name}</Text>
            {' '}— {formatCurrency(vehicle.price)}
          </Text>
        </View>
      )}

      {/* Mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isUserMsg = item.sender === 'user';
          const isAdminMsg = item.sender === 'admin';
          const isRight = isUserMsg || isAdminMsg;

          return (
            <View style={[styles.msgWrapper, isRight ? styles.msgWrapperRight : styles.msgWrapperLeft]}>
              {!isRight && (
                <View style={[styles.avatarSmall, { backgroundColor: 'rgba(201,162,39,0.15)', borderColor: colors.primary }]}>
                  <Ionicons name={item.isAI ? 'sparkles' : 'person'} size={13} color={colors.primary} />
                </View>
              )}
              <View style={[
                styles.bubble,
                isUserMsg && { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
                isAdminMsg && { backgroundColor: colors.info, borderBottomRightRadius: 4 },
                !isRight && { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 }
              ]}>
                {isAdminMsg && (
                  <Text style={styles.adminLabel}>👤 Gerente</Text>
                )}
                {!isRight && item.isAI && (
                  <Text style={[styles.aiLabel, { color: colors.primary }]}>✨ Assistente IA</Text>
                )}
                <Text style={[styles.bubbleText, { color: isRight ? colors.background : colors.text }]}>
                  {item.text}
                </Text>
                <View style={styles.bubbleMeta}>
                  <Text style={[styles.bubbleTime, { color: isRight ? 'rgba(10,10,15,0.6)' : colors.muted }]}>
                    {formatTime(item.time)}
                  </Text>
                  {isRight && (
                    <Ionicons name={item.status === 'read' ? 'checkmark-done' : 'checkmark'} size={12}
                      color={item.status === 'read' ? (isUserMsg ? 'rgba(10,10,15,0.8)' : '#fff') : 'rgba(10,10,15,0.4)'} />
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListFooterComponent={isTyping ? (
          <View style={[styles.msgWrapper, styles.msgWrapperLeft]}>
            <View style={[styles.avatarSmall, { backgroundColor: 'rgba(201,162,39,0.15)', borderColor: colors.primary }]}>
              <Ionicons name="sparkles" size={13} color={colors.primary} />
            </View>
            <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 }]}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          </View>
        ) : null}
      />

      {/* Botões admin */}
      {isAdmin && negotiationStatus === 'OPEN' && (
        <View style={[styles.adminBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.refuseBtn, { borderColor: colors.danger }]} onPress={() => handleAdminAction('NOT_SOLD')}>
            <Ionicons name="close-circle" size={16} color={colors.danger} />
            <Text style={[styles.refuseBtnText, { color: colors.danger }]}>Recusar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.approveBtn, { backgroundColor: colors.success }]} onPress={() => handleAdminAction('SOLD')}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.approveBtnText}>Aprovar venda</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mensagens rápidas — só cliente */}
      {!isAdmin && negotiationStatus === 'OPEN' && (
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
      )}

      {/* Input */}
      {negotiationStatus === 'OPEN' && (!isAdmin || adminMode) && (
        <View style={[styles.inputArea, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {isAdmin && adminMode && (
            <View style={[styles.adminInputBadge, { backgroundColor: `${colors.info}20` }]}>
              <Ionicons name="shield-checkmark" size={12} color={colors.info} />
              <Text style={[styles.adminInputBadgeText, { color: colors.info }]}>Respondendo como gerente</Text>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={isAdmin ? 'Responder como gerente...' : 'Digite uma mensagem...'}
              placeholderTextColor={colors.muted}
              style={[styles.input, { backgroundColor: colors.input, borderColor: isAdmin && adminMode ? colors.info : colors.border, color: colors.text }]}
              multiline maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: input.trim() && !isTyping ? (isAdmin ? colors.info : colors.primary) : colors.card }]}
              onPress={sendMessage}
              disabled={!input.trim() || isTyping}
            >
              <Ionicons name="send" size={18} color={input.trim() ? colors.background : colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {negotiationStatus !== 'OPEN' && (
        <View style={[styles.closedBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Ionicons name={negotiationStatus === 'SOLD' ? 'checkmark-circle' : 'close-circle'} size={18}
            color={negotiationStatus === 'SOLD' ? colors.success : colors.danger} />
          <Text style={[styles.closedText, { color: negotiationStatus === 'SOLD' ? colors.success : colors.danger }]}>
            {negotiationStatus === 'SOLD' ? 'Venda aprovada! ✅' : 'Negociação encerrada'}
          </Text>
        </View>
      )}
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
  onlineDot: { width: 7, height: 7, borderRadius: 3.5 },
  onlineText: { fontSize: 11, fontWeight: '600' },
  adminToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  adminToggleText: { fontSize: 11, fontWeight: '800' },
  vehicleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, paddingHorizontal: 16, paddingVertical: 8 },
  vehicleBannerText: { fontSize: 13, flex: 1 },
  messagesList: { padding: 16, gap: 10, paddingBottom: 8 },
  msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgWrapperRight: { justifyContent: 'flex-end' },
  msgWrapperLeft: { justifyContent: 'flex-start' },
  avatarSmall: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  adminLabel: { color: '#fff', fontSize: 10, fontWeight: '800', marginBottom: 4, opacity: 0.8 },
  aiLabel: { fontSize: 10, fontWeight: '800', marginBottom: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end' },
  bubbleTime: { fontSize: 10 },
  adminBar: { flexDirection: 'row', gap: 10, padding: 12, borderTopWidth: 1 },
  refuseBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingVertical: 12 },
  refuseBtnText: { fontWeight: '800', fontSize: 14 },
  approveBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 12 },
  approveBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  quickRow: { flexDirection: 'row', gap: 8, padding: 8, flexWrap: 'wrap', borderTopWidth: 1 },
  quickChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  quickChipText: { fontSize: 12, fontWeight: '600' },
  inputArea: { borderTopWidth: 1 },
  adminInputBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingTop: 8 },
  adminInputBadgeText: { fontSize: 11, fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12 },
  input: { flex: 1, borderRadius: 22, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  closedBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderTopWidth: 1 },
  closedText: { fontWeight: '700', fontSize: 14 },
});
