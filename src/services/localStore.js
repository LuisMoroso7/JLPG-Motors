import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = '@jlpg-motors:preferences';
const USER_STATE_PREFIX = '@jlpg-motors:user-state:';

const DEFAULT_USER_STATE = {
  favorites: [],
  proposal: [],
  orders: [],
  compareVehicles: [],
  recentlyViewed: [],
  testDrives: [],
  priceAlerts: [],
};

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getUserStateKey(user) {
  const identity = user?.id || user?.email || user?.username || 'guest';
  return `${USER_STATE_PREFIX}${identity}`;
}

export async function loadPreferences() {
  const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
  if (!raw) return { showOnboarding: true };

  try {
    const parsed = JSON.parse(raw);
    return {
      showOnboarding: parsed?.showOnboarding !== false,
    };
  } catch (e) {
    await AsyncStorage.removeItem(PREFERENCES_KEY);
    return { showOnboarding: true };
  }
}

export async function savePreferences(preferences) {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export async function loadUserState(user) {
  const raw = await AsyncStorage.getItem(getUserStateKey(user));
  if (!raw) return DEFAULT_USER_STATE;

  try {
    const parsed = JSON.parse(raw);
    return {
      favorites: safeArray(parsed?.favorites),
      proposal: safeArray(parsed?.proposal),
      orders: safeArray(parsed?.orders),
      compareVehicles: safeArray(parsed?.compareVehicles),
      recentlyViewed: safeArray(parsed?.recentlyViewed),
      testDrives: safeArray(parsed?.testDrives),
      priceAlerts: safeArray(parsed?.priceAlerts),
    };
  } catch (e) {
    await AsyncStorage.removeItem(getUserStateKey(user));
    return DEFAULT_USER_STATE;
  }
}

export async function saveUserState(user, state) {
  if (!user) return;

  await AsyncStorage.setItem(getUserStateKey(user), JSON.stringify({
    favorites: safeArray(state.favorites),
    proposal: safeArray(state.proposal),
    orders: safeArray(state.orders),
    compareVehicles: safeArray(state.compareVehicles),
    recentlyViewed: safeArray(state.recentlyViewed),
    testDrives: safeArray(state.testDrives),
    priceAlerts: safeArray(state.priceAlerts),
  }));
}
