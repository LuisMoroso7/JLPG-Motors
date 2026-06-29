import React, { useRef, useState } from 'react';
import {
  Animated, Dimensions, FlatList, Image,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'car-sport',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80',
    title: 'Seu próximo carro\nestá aqui',
    subtitle: 'Explore centenas de veículos premium selecionados com todo o cuidado para você.',
    color: colors.primary,
  },
  {
    id: '2',
    icon: 'git-compare',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80',
    title: 'Compare e escolha\ncom confiança',
    subtitle: 'Analise dois veículos lado a lado. Preço, quilometragem, câmbio e muito mais.',
    color: colors.info,
  },
  {
    id: '3',
    icon: 'calculator',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&q=80',
    title: 'Simule seu\nfinanciamento',
    subtitle: 'Calcule parcelas em segundos. Escolha o prazo ideal para o seu bolso.',
    color: colors.success,
  },
  {
    id: '4',
    icon: 'chatbubbles',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=900&q=80',
    title: 'Negocie direto\ncom a equipe',
    subtitle: 'Chat, proposta de compra e agendamento de test drive. Tudo em um só lugar.',
    color: colors.primary,
  },
];

export default function OnboardingScreen({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  function goNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      onFinish();
    }
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / W);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.slideImage} />
            <LinearGradient
              colors={['transparent', 'rgba(10,10,15,0.7)', 'rgba(10,10,15,0.98)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.slideContent}>
              <View style={[styles.iconRing, { borderColor: item.color, backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={36} color={item.color} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Logo */}
      <View style={styles.logoArea}>
        <Text style={styles.logo}>JLPG <Text style={styles.logoGold}>MOTORS</Text></Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * W, i * W, (i + 1) * W];
            const width = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
            return <Animated.View key={i} style={[styles.dot, { width, opacity }]} />;
          })}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
          <LinearGradient colors={[colors.primaryLight, colors.primary, colors.primaryDark]} style={styles.nextBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.nextBtnText}>
              {activeIndex === SLIDES.length - 1 ? 'Começar' : 'Próximo'}
            </Text>
            <Ionicons name={activeIndex === SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'} size={18} color={colors.background} />
          </LinearGradient>
        </TouchableOpacity>

        {activeIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  slide: { width: W, height: H },
  slideImage: { width: '100%', height: '100%', position: 'absolute' },
  slideContent: { position: 'absolute', bottom: 200, left: 28, right: 28, alignItems: 'center' },
  iconRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  slideTitle: { color: colors.text, fontSize: 34, fontWeight: '900', textAlign: 'center', lineHeight: 42, marginBottom: 14 },
  slideSubtitle: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22 },
  logoArea: { position: 'absolute', top: 56, left: 0, right: 0, alignItems: 'center' },
  logo: { color: colors.text, fontSize: 22, fontWeight: '900', letterSpacing: 4 },
  logoGold: { color: colors.primary },
  bottom: { position: 'absolute', bottom: 48, left: 28, right: 28, alignItems: 'center', gap: 16 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
  nextBtn: { width: '100%', borderRadius: 18, overflow: 'hidden' },
  nextBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  nextBtnText: { color: colors.background, fontWeight: '900', fontSize: 16 },
  skipBtn: { paddingVertical: 8 },
  skipText: { color: colors.muted, fontSize: 14 },
});
