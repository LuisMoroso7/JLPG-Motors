import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary
  }
};

function MainTabs(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted
      }}
    >
      <Tab.Screen name="Início">{(screenProps) => <HomeScreen {...screenProps} {...props} />}</Tab.Screen>
      <Tab.Screen name="Catálogo">{(screenProps) => <CatalogScreen {...screenProps} {...props} />}</Tab.Screen>
      <Tab.Screen name="Favoritos">{(screenProps) => <FavoritesScreen {...screenProps} {...props} />}</Tab.Screen>
      <Tab.Screen name="Proposta">{(screenProps) => <ProposalScreen {...screenProps} {...props} />}</Tab.Screen>
      <Tab.Screen name="Histórico">{(screenProps) => <HistoryScreen {...screenProps} {...props} />}</Tab.Screen>
      <Tab.Screen name="Perfil">{(screenProps) => <ProfileScreen {...screenProps} {...props} />}</Tab.Screen>
      <Tab.Screen name="Admin">{(screenProps) => <AdminScreen {...screenProps} {...props} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator(props) {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: '900' } }}>
        {!props.user ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(screenProps) => <LoginScreen {...screenProps} setUser={props.setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Cadastro" options={{ title: 'Cadastro' }}>
              {(screenProps) => <RegisterScreen {...screenProps} setUser={props.setUser} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="JLPG Motors" options={{ headerShown: false }}>
              {(screenProps) => <MainTabs {...screenProps} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Detalhes" options={{ title: 'Detalhes do veículo' }}>
              {(screenProps) => <DetailsScreen {...screenProps} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="FormulárioVeículo" options={{ title: 'Veículo' }}>
              {(screenProps) => <VehicleFormScreen {...screenProps} {...props} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
