import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
    primary: colors.primary,
  },
};

function Badge({ count }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

function MainTabs(props) {
  const isAdmin = props.user?.role === 'ADMIN';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            'Início': focused ? 'home' : 'home-outline',
            'Catálogo': focused ? 'car-sport' : 'car-sport-outline',
            'Favoritos': focused ? 'heart' : 'heart-outline',
            'Proposta': focused ? 'document-text' : 'document-text-outline',
            'Histórico': focused ? 'time' : 'time-outline',
            'Perfil': focused ? 'person' : 'person-outline',
            'Admin': focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início">
        {(screenProps) => <HomeScreen {...screenProps} {...props} />}
      </Tab.Screen>

      <Tab.Screen name="Catálogo">
        {(screenProps) => <CatalogScreen {...screenProps} {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="Favoritos"
        options={{
          tabBarBadge: props.favorites?.length > 0 ? props.favorites.length : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      >
        {(screenProps) => <FavoritesScreen {...screenProps} {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="Proposta"
        options={{
          tabBarBadge: props.proposal?.length > 0 ? props.proposal.length : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      >
        {(screenProps) => <ProposalScreen {...screenProps} {...props} />}
      </Tab.Screen>

      <Tab.Screen name="Histórico">
        {(screenProps) => <HistoryScreen {...screenProps} {...props} />}
      </Tab.Screen>

      <Tab.Screen name="Perfil">
        {(screenProps) => <ProfileScreen {...screenProps} {...props} />}
      </Tab.Screen>

      {isAdmin && (
        <Tab.Screen name="Admin">
          {(screenProps) => <AdminScreen {...screenProps} {...props} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator(props) {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '900', color: colors.text },
          headerShadowVisible: false,
        }}
      >
        {!props.user ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(screenProps) => <LoginScreen {...screenProps} setUser={props.setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Cadastro" options={{ title: 'Criar cadastro' }}>
              {(screenProps) => <RegisterScreen {...screenProps} setUser={props.setUser} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="JLPG Motors" options={{ headerShown: false }}>
              {(screenProps) => <MainTabs {...screenProps} {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Detalhes" options={{ title: 'Detalhes do Veículo' }}>
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: colors.primary,
    color: colors.background,
    fontSize: 10,
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: '900',
  },
});
