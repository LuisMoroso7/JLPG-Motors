import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineBanner from './src/components/OfflineBanner';
import { initialVehicles } from './src/data/vehicles';
import {
  apiLoadSession,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetGreeting,
  apiGetVehicles,
  apiGetVehicleById,
  apiCreateVehicle,
  apiUpdateVehicle,
  apiDeleteVehicle,
  apiCreateOrder,
  apiGetOrders,
} from './src/services/api';
import {
  loadPreferences,
  savePreferences,
  loadUserState,
  saveUserState,
} from './src/services/localStore';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isBackendId(id) {
  return UUID_RE.test(String(id || ''));
}

function mergeOrders(remoteOrders, currentOrders) {
  const localOrders = currentOrders.filter((order) => order.local || order.status === 'LOCAL');
  const ids = new Set(remoteOrders.map((order) => order.id));
  return [...remoteOrders, ...localOrders.filter((order) => !ids.has(order.id))];
}

function buildLocalOrder(vehicles) {
  const createdAt = new Date();
  const items = vehicles.map((vehicle) => ({
    id: String(vehicle.id),
    name: vehicle.name,
    quantity: vehicle.quantity || 1,
    price: Number(vehicle.price || 0),
    currency: vehicle.targetCurrency || 'BRL',
  }));

  return {
    id: `LOCAL-${createdAt.getTime()}`,
    local: true,
    status: 'LOCAL',
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    currency: 'BRL',
    createdAt: createdAt.toISOString(),
    date: createdAt.toLocaleDateString('pt-BR'),
  };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [favorites, setFavorites] = useState([]);
  const [proposal, setProposal] = useState([]);
  const [orders, setOrders] = useState([]);
  const [compareVehicles, setCompareVehicles] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [backendChecked, setBackendChecked] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [usingLocalVehicles, setUsingLocalVehicles] = useState(true);
  const [localReady, setLocalReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function boot() {
      try {
        const [preferences, savedUser] = await Promise.all([
          loadPreferences(),
          apiLoadSession().catch(() => null),
        ]);
        if (!active) return;

        setShowOnboarding(preferences.showOnboarding);
        if (active && savedUser) setUser(savedUser);
      } catch (e) {}

      loadBackendStatus();
    }

    boot();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user) {
      hydrateLocalState(user);
      loadVehiclesFromBack();
      loadOrdersFromBack();
    } else {
      setLocalReady(false);
    }
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (!user || !localReady) return;

    saveUserState(user, {
      favorites,
      proposal,
      orders,
      compareVehicles,
      recentlyViewed,
      testDrives,
      priceAlerts,
    }).catch(() => {});
  }, [user, localReady, favorites, proposal, orders, compareVehicles, recentlyViewed, testDrives, priceAlerts]);

  async function hydrateLocalState(userData) {
    setLocalReady(false);
    try {
      const state = await loadUserState(userData);
      setFavorites(state.favorites);
      setProposal(state.proposal);
      setOrders(state.orders);
      setCompareVehicles(state.compareVehicles);
      setRecentlyViewed(state.recentlyViewed);
      setTestDrives(state.testDrives);
      setPriceAlerts(state.priceAlerts);
    } finally {
      setLocalReady(true);
    }
  }

  async function finishOnboarding() {
    setShowOnboarding(false);
    await savePreferences({ showOnboarding: false });
  }

  async function loadBackendStatus() {
    try {
      const message = await apiGetGreeting();
      setBackendMessage(message);
      setBackendOnline(true);
    } catch (e) {
      setBackendOnline(false);
    } finally {
      setBackendChecked(true);
    }
  }

  async function loadVehiclesFromBack() {
    setLoadingVehicles(true);
    try {
      const backVehicles = await apiGetVehicles();
      setBackendOnline(true);
      setBackendChecked(true);
      if (backVehicles.length > 0) {
        setVehicles(backVehicles);
        setUsingLocalVehicles(false);
      } else {
        setVehicles(initialVehicles);
        setUsingLocalVehicles(true);
      }
      return backVehicles;
    } catch (e) {
      setBackendOnline(false);
      setBackendChecked(true);
      setUsingLocalVehicles(true);
      console.log('Back offline, usando dados locais');
      return null;
    } finally {
      setLoadingVehicles(false);
    }
  }

  async function loadOrdersFromBack() {
    try {
      const backOrders = await apiGetOrders('BRL');
      setOrders((current) => mergeOrders(backOrders, current));
      return backOrders;
    } catch (e) {}
    return null;
  }

  async function loadVehicleDetails(vehicleId) {
    if (!isBackendId(vehicleId)) {
      return vehicles.find((item) => item.id === vehicleId) || null;
    }

    const vehicle = await apiGetVehicleById(vehicleId, 'BRL');
    setVehicles((current) => (
      current.some((item) => item.id === vehicle.id)
        ? current.map((item) => item.id === vehicle.id ? { ...item, ...vehicle } : item)
        : [vehicle, ...current]
    ));
    return vehicle;
  }

  async function handleLogin(email, password) {
    try {
      const data = await apiLogin(email, password);
      return data.user;
    } catch (e) {
      throw new Error(e.message || 'Usuario ou senha invalidos.');
    }
  }

  async function handleRegister(data) {
    await apiRegister({
      username: data.username || data.name,
      email: data.email,
      password: data.password,
    });

    const loginData = await apiLogin(data.email, data.password);
    return loginData.user;
  }

  function setUserAndLoad(userData) {
    setUser(userData);
  }

  async function logout() {
    await apiLogout();
    setUser(null);
    setFavorites([]);
    setProposal([]);
    setOrders([]);
    setCompareVehicles([]);
    setRecentlyViewed([]);
    setTestDrives([]);
    setPriceAlerts([]);
  }

  function toggleFavorite(vehicleId) {
    setFavorites((current) =>
      current.includes(vehicleId) ? current.filter((id) => id !== vehicleId) : [...current, vehicleId]
    );
  }

  function addToProposal(vehicle) {
    setProposal((current) => {
      if (current.some((item) => item.id === vehicle.id)) {
        Alert.alert('Ja adicionado', `${vehicle.name} ja esta na proposta.`);
        return current;
      }
      Alert.alert('Adicionado', `${vehicle.name} foi adicionado a proposta.`);
      return [...current, vehicle];
    });
  }

  function removeFromProposal(vehicleId) {
    setProposal((current) => current.filter((item) => item.id !== vehicleId));
  }

  async function finishOrder() {
    if (proposal.length === 0) return;

    if (!backendOnline || !proposal.every((vehicle) => isBackendId(vehicle.id))) {
      const localOrder = buildLocalOrder(proposal);
      setOrders((current) => [localOrder, ...current]);
      setProposal([]);
      Alert.alert(
        'Solicitacao salva!',
        backendOnline
          ? 'Estes veiculos estao em dados locais. A solicitacao ficou salva no app.'
          : 'Backend indisponivel no momento. A solicitacao ficou salva no app.'
      );
      return;
    }

    try {
      const createdOrder = await apiCreateOrder(proposal, 'BRL');
      setOrders((current) => [createdOrder, ...current]);
      setProposal([]);
      Alert.alert('Solicitacao gerada!', 'A JLPG Motors entrara em contato para continuar a negociacao.');
      loadOrdersFromBack();
    } catch (e) {
      Alert.alert('Erro ao gerar solicitacao', e.message || 'Nao foi possivel enviar a proposta para o backend.');
    }
  }

  async function saveVehicle(vehicle) {
    const normalized = {
      ...vehicle,
      price: Number(vehicle.price) || 0,
      km: Number(vehicle.km) || 0,
      stock: Number(vehicle.stock) || 1,
      year: Number(vehicle.year) || 2024,
      image: vehicle.image || '',
      images: vehicle.images || (vehicle.image ? [vehicle.image] : []),
      featured: vehicle.featured || false,
    };

    try {
      if (normalized.id && vehicles.find((item) => item.id === normalized.id)) {
        const updated = await apiUpdateVehicle(normalized.id, normalized);
        setVehicles((current) => current.map((item) => item.id === normalized.id ? { ...item, ...updated } : item));
      } else {
        const created = await apiCreateVehicle(normalized);
        setVehicles((current) => [created, ...current]);
      }
      setUsingLocalVehicles(false);
      setBackendOnline(true);
      setBackendChecked(true);
    } catch (e) {
      throw new Error(e.message || 'Nao foi possivel salvar o veiculo no backend.');
    }
  }

  async function deleteVehicle(vehicleId) {
    try {
      await apiDeleteVehicle(vehicleId);
    } catch (e) {
      Alert.alert('Erro ao remover veiculo', e.message || 'Nao foi possivel remover o veiculo no backend.');
      return;
    }

    setVehicles((current) => current.filter((item) => item.id !== vehicleId));
    setFavorites((current) => current.filter((id) => id !== vehicleId));
    setProposal((current) => current.filter((item) => item.id !== vehicleId));
    setCompareVehicles((current) => current.filter((item) => item.id !== vehicleId));
    setRecentlyViewed((current) => current.filter((item) => item.id !== vehicleId));
  }

  function addRecentlyViewed(vehicle) {
    setRecentlyViewed((current) => [vehicle, ...current.filter((item) => item.id !== vehicle.id)].slice(0, 5));
  }

  function saveTestDrive(testDrive) {
    setTestDrives((current) => [testDrive, ...current]);
  }

  function updateTestDriveStatus(id, status) {
    setTestDrives((current) => current.map((testDrive) => testDrive.id === id ? { ...testDrive, status } : testDrive));
    const msg = status === 'approved' ? 'Test drive confirmado!' : 'Test drive recusado.';
    Alert.alert(msg, status === 'approved' ? 'O cliente sera notificado.' : 'Agendamento cancelado.');
  }

  function addPriceAlert(alert) {
    setPriceAlerts((current) => {
      if (current.find((item) => item.vehicleId === alert.vehicleId)) {
        Alert.alert('Alerta ja existe', 'Voce ja tem um alerta para este veiculo.');
        return current;
      }
      Alert.alert('Alerta criado!', `Voce sera notificado quando ${alert.vehicleName} baixar para ${alert.targetPriceFormatted}.`);
      return [{ ...alert, id: String(Date.now()) }, ...current];
    });
  }

  function removePriceAlert(alertId) {
    setPriceAlerts((current) => current.filter((alert) => alert.id !== alertId));
  }

  return (
    <>
      <StatusBar style="light" />
      <OfflineBanner visible={backendChecked && !backendOnline} />
      <AppNavigator
        showOnboarding={showOnboarding}
        finishOnboarding={finishOnboarding}
        user={user}
        setUser={setUserAndLoad}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        logout={logout}
        vehicles={vehicles}
        favorites={favorites}
        proposal={proposal}
        orders={orders}
        compareVehicles={compareVehicles}
        setCompareVehicles={setCompareVehicles}
        recentlyViewed={recentlyViewed}
        addRecentlyViewed={addRecentlyViewed}
        testDrives={testDrives}
        saveTestDrive={saveTestDrive}
        updateTestDriveStatus={updateTestDriveStatus}
        priceAlerts={priceAlerts}
        addPriceAlert={addPriceAlert}
        removePriceAlert={removePriceAlert}
        toggleFavorite={toggleFavorite}
        addToProposal={addToProposal}
        removeFromProposal={removeFromProposal}
        finishOrder={finishOrder}
        saveVehicle={saveVehicle}
        deleteVehicle={deleteVehicle}
        refreshVehicles={loadVehiclesFromBack}
        refreshOrders={loadOrdersFromBack}
        loadVehicleDetails={loadVehicleDetails}
        backendOnline={backendOnline}
        backendChecked={backendChecked}
        backendMessage={backendMessage}
        loadingVehicles={loadingVehicles}
        usingLocalVehicles={usingLocalVehicles}
      />
    </>
  );
}
