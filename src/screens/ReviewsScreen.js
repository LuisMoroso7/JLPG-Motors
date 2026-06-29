import React, { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const MOCK_REVIEWS = [
  { id: '1', author: 'Carlos M.', rating: 5, text: 'Carro perfeito, exatamente como anunciado. Atendimento da JLPG foi excelente, processo rápido e transparente!', date: '15/06/2026', verified: true },
  { id: '2', author: 'Ana P.', rating: 4, text: 'Muito satisfeita com a compra. O veículo estava em ótimo estado e o financiamento foi aprovado rapidamente.', date: '10/06/2026', verified: true },
  { id: '3', author: 'Roberto S.', rating: 5, text: 'Negociação justa e honesta. Recomendo a JLPG para quem quer comprar um bom seminovo com segurança.', date: '02/06/2026', verified: false },
];

function Stars({ rating, size = 16, onSelect }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onSelect?.(i)} disabled={!onSelect}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={i <= rating ? colors.primary : colors.muted}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewsScreen({ route, user }) {
  const vehicle = route?.params?.vehicle;
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rv) => rv.rating === r).length,
    pct: Math.round((reviews.filter((rv) => rv.rating === r).length / reviews.length) * 100),
  }));

  function submitReview() {
    if (!newText.trim()) { Alert.alert('Escreva sua avaliação'); return; }
    setReviews((r) => [{
      id: String(Date.now()),
      author: user?.name?.split(' ')[0] + ' ' + (user?.name?.split(' ')[1]?.[0] || '') + '.',
      rating: newRating,
      text: newText.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      verified: true,
    }, ...r]);
    setNewText('');
    setNewRating(5);
    setShowModal(false);
    Alert.alert('✅ Avaliação enviada!', 'Obrigado pela sua avaliação.');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {vehicle && (
          <View style={styles.vehicleBanner}>
            <Ionicons name="car-outline" size={16} color={colors.primary} />
            <Text style={styles.vehicleBannerText} numberOfLines={1}>{vehicle.name}</Text>
          </View>
        )}

        {/* Resumo */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.avgScore}>{avg}</Text>
            <Stars rating={Math.round(avg)} size={20} />
            <Text style={styles.totalReviews}>{reviews.length} avaliações</Text>
          </View>
          <View style={styles.summaryRight}>
            {dist.map((d) => (
              <View key={d.rating} style={styles.distRow}>
                <Text style={styles.distLabel}>{d.rating}</Text>
                <Ionicons name="star" size={10} color={colors.primary} />
                <View style={styles.distBar}>
                  <View style={[styles.distBarFill, { width: `${d.pct}%` }]} />
                </View>
                <Text style={styles.distCount}>{d.count}</Text>
              </View>
            ))}
          </View>
        </View>

        <PrimaryButton title="Escrever avaliação" onPress={() => setShowModal(true)} style={styles.writeBtn} />

        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{item.author[0]}</Text>
                </View>
                <View style={styles.reviewAuthorInfo}>
                  <View style={styles.reviewAuthorRow}>
                    <Text style={styles.reviewAuthor}>{item.author}</Text>
                    {item.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={11} color={colors.success} />
                        <Text style={styles.verifiedText}>Compra verificada</Text>
                      </View>
                    )}
                  </View>
                  <Stars rating={item.rating} size={13} />
                </View>
                <Text style={styles.reviewDate}>{item.date}</Text>
              </View>
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </ScrollView>

      {/* Modal de nova avaliação */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sua avaliação</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Nota</Text>
            <Stars rating={newRating} size={36} onSelect={setNewRating} />
            <Text style={styles.ratingLabel}>
              {['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente!'][newRating]}
            </Text>
            <Text style={styles.modalLabel}>Comentário</Text>
            <TextInput
              value={newText}
              onChangeText={setNewText}
              placeholder="Conte sua experiência..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              style={styles.modalInput}
            />
            <PrimaryButton title="Enviar avaliação" onPress={submitReview} style={styles.submitBtn} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 40 },
  vehicleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(201,162,39,0.08)', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)' },
  vehicleBannerText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  summaryCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 16, gap: 16 },
  summaryLeft: { alignItems: 'center', gap: 6 },
  avgScore: { color: colors.text, fontSize: 52, fontWeight: '900', lineHeight: 56 },
  totalReviews: { color: colors.muted, fontSize: 12 },
  summaryRight: { flex: 1, gap: 6, justifyContent: 'center' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  distLabel: { color: colors.muted, fontSize: 12, width: 10 },
  distBar: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  distBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  distCount: { color: colors.muted, fontSize: 12, width: 16, textAlign: 'right' },
  writeBtn: { marginBottom: 18 },
  reviewCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: colors.primary, fontWeight: '900', fontSize: 16 },
  reviewAuthorInfo: { flex: 1, gap: 4 },
  reviewAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  reviewAuthor: { color: colors.text, fontWeight: '800', fontSize: 14 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedText: { color: colors.success, fontSize: 10, fontWeight: '700' },
  reviewDate: { color: colors.muted, fontSize: 11 },
  reviewText: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, borderTopWidth: 1, borderTopColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  modalLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 16 },
  ratingLabel: { color: colors.primary, fontWeight: '800', fontSize: 16, marginTop: 8 },
  modalInput: { backgroundColor: colors.input, borderRadius: 14, borderWidth: 1, borderColor: colors.border, color: colors.text, padding: 14, fontSize: 14, minHeight: 100, textAlignVertical: 'top', marginBottom: 8 },
  submitBtn: { marginTop: 8 },
});
