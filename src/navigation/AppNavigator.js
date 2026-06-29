import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { darkColors } from '../theme/colors';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProposalScreen from '../screens/ProposalScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import VehicleFormScreen from '../screens/VehicleFormScreen';
import CompareScreen from '../screens/CompareScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ChatScreen from '../screens/ChatScreen';
import TestDriveScreen from '../screens/TestDriveScreen';
import StoreScreen from '../screens/StoreScreen';
import ReviewsScreen from '../screens/ReviewsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function makeTheme(colors) {
  return {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface, text: colors.text, border: colors.border, primary: colors.primary },
  };
}

function MainTabs(props) {
  const colors = props.colors || darkColors;
  const isAdmin = props.user?.role === 'ADMIN';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.surface, borderTopColor: colors.border }],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            'Início': focused ? 'home' : 'home-outline',
            'Catálogo': focused ? 'car-sport' : 'car-sport-outline',
            'Favoritos': focused ? 'heart' : 'heart-outline',
            'Proposta': focused ? 'document-text' : 'document-text-outline',
            'Histórico': focused ? 'time' : 'time-outline',
            'Comparar': focused ? 'git-compare' : 'git-compare-outline',
            'Perfil': focused ? 'person' : 'person-outline',
            'Admin': focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início">{(sp) => <HomeScreen {...sp} {...props} />}</Tab.Screen>
      <Tab.Screen name="Catálogo">{(sp) => <CatalogScreen {...sp} {...props} />}</Tab.Screen>
      <Tab.Screen name="Favoritos" options={{ tabBarBadge: props.favorites?.length > 0 ? props.favorites.length : undefined, tabBarBadgeStyle: [styles.tabBadge, { backgroundColor: colors.primary }] }}>
        {(sp) => <FavoritesScreen {...sp} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Proposta" options={{ tabBarBadge: props.proposal?.length > 0 ? props.proposal.length : undefined, tabBarBadgeStyle: [styles.tabBadge, { backgroundColor: colors.primary }] }}>
        {(sp) => <ProposalScreen {...sp} {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Histórico">{(sp) => <HistoryScreen {...sp} {...props} />}</Tab.Screen>
      <Tab.Screen name="Comparar">{(sp) => <CompareScreen {...sp} {...props} />}</Tab.Screen>
      <Tab.Screen name="Perfil">{(sp) => <ProfileScreen {...sp} {...props} />}</Tab.Screen>
      {isAdmin && <Tab.Screen name="Admin">{(sp) => <AdminScreen {...sp} {...props} />}</Tab.Screen>}
    </Tab.Navigator>
  );
}

export default function AppNavigator(props) {
  const colors = props.colors || darkColors;
  const headerStyle = { backgroundColor: colors.surface };
  const headerOptions = { headerStyle, headerTintColor: colors.text, headerTitleStyle: { fontWeight: '900', color: colors.text }, headerShadowVisible: false };

  return (
    <NavigationContainer theme={makeTheme(colors)}>
      <Stack.Navigator screenOptions={headerOptions}>
        {props.showOnboarding ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {() => <OnboardingScreen onFinish={props.finishOnboarding} />}
          </Stack.Screen>
        ) : !props.user ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>{(sp) => <LoginScreen {...sp} setUser={props.setUser} />}</Stack.Screen>
            <Stack.Screen name="Cadastro" options={{ title: 'Criar cadastro' }}>{(sp) => <RegisterScreen {...sp} setUser={props.setUser} />}</Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="JLPG Motors" options={{ headerShown: false }}>{(sp) => <MainTabs {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="Detalhes" options={{ title: 'Detalhes do Veículo' }}>{(sp) => <DetailsScreen {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="FormulárioVeículo" options={{ title: 'Veículo' }}>{(sp) => <VehicleFormScreen {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="Notificações" options={{ title: 'Notificações' }}>{(sp) => <NotificationsScreen {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="Chat" options={{ title: 'Chat com Vendedor', headerShown: false }}>{(sp) => <ChatScreen {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="TestDrive" options={{ title: 'Agendar Test Drive' }}>{(sp) => <TestDriveScreen {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="Loja" options={{ title: 'Nossa Loja' }}>{(sp) => <StoreScreen {...sp} {...props} />}</Stack.Screen>
            <Stack.Screen name="Avaliações" options={{ title: 'Avaliações' }}>{(sp) => <ReviewsScreen {...sp} {...props} />}</Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 62, paddingBottom: 8, paddingTop: 6, borderTopWidth: 1 },
  tabLabel: { fontSize: 10, fontWeight: '700' },
  tabBadge: { color: '#0A0A0F', fontSize: 10, fontWeight: '900' },
});
