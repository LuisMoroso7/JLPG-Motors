import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initialVehicles } from './src/data/vehicles';
import {
  apiLoadSession,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetVehicles,
  apiCreateVehicle,
  apiUpdateVehicle,
  apiDeleteVehicle,
  apiCreateOrder,
  apiGetOrders,
} from './src/services/api';

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

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const savedUser = await apiLoadSession();
        if (active && savedUser) setUser(savedUser);
      } catch (e) {}
    }

    restoreSession();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user) {
      loadVehiclesFromBack();
      loadOrdersFromBack();
    }
  }, [user]);

  async function loadVehiclesFromBack() {
    try {
      const backVehicles = await apiGetVehicles();
      setBackendOnline(true);
      if (backVehicles.length > 0) setVehicles(backVehicles);
    } catch (e) {
      setBackendOnline(false);
      console.log('Back offline, usando dados locais');
    }
  }

  async function loadOrdersFromBack() {
    try {
      const backOrders = await apiGetOrders('BRL');
      setOrders(backOrders);
    } catch (e) {}
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

    try {
      const createdOrder = await apiCreateOrder(proposal, 'BRL');
      setOrders((current) => [createdOrder, ...current]);
      setProposal([]);
      Alert.alert('Solicitacao gerada!', 'A JLPG Motors entrara em contato para continuar a negociacao.');
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
      <AppNavigator
        showOnboarding={showOnboarding}
        finishOnboarding={() => setShowOnboarding(false)}
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
        backendOnline={backendOnline}
      />
    </>
  );
}
