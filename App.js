import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initialVehicles } from './src/data/vehicles';
import {
  apiLogin, apiRegister, apiLogout,
  apiGetVehicles, apiCreateVehicle, apiUpdateVehicle, apiDeleteVehicle,
  apiToggleFavorite, apiGetFavorites,
  apiStartNegotiation, apiGetMyNegotiations, apiCloseNegotiation,
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

  // Carregar veículos do back quando logar
  useEffect(() => {
    if (user) loadVehiclesFromBack();
  }, [user]);

  async function loadVehiclesFromBack() {
    try {
      const backVehicles = await apiGetVehicles();
      if (backVehicles.length > 0) {
        setVehicles(backVehicles);
        setBackendOnline(true);
      }
      // Se vazio, mantém os veículos mockados
    } catch (e) {
      console.log('Back offline, usando dados locais');
    }
  }

  async function handleLogin(email, password) {
    try {
      const data = await apiLogin(email, password);
      return {
        id: data.id,
        name: data.username,
        email: data.email,
        role: data.role === 'ADMIN' ? 'ADMIN' : 'USER',
      };
    } catch (e) {
      // Fallback para login local se back offline
      const isAdmin = email.toLowerCase() === 'adm@jlpg.com' && password === 'senha123';
      if (email.includes('@') && password.length >= 6) {
        return {
          name: isAdmin ? 'Administrador JLPG' : 'Cliente JLPG',
          email,
          role: isAdmin ? 'ADMIN' : 'USER',
        };
      }
      throw new Error('Usuário ou senha inválidos!');
    }
  }

  async function handleRegister(data) {
    try {
      await apiRegister(data);
    } catch (e) {
      console.log('Register fallback local');
    }
    return {
      name: data.username || data.name,
      email: data.email,
      role: 'USER',
    };
  }

  function setUserAndLoad(userData) {
    setUser(userData);
  }

  function logout() {
    apiLogout();
    setUser(null);
    setFavorites([]);
    setProposal([]);
    setOrders([]);
  }

  function toggleFavorite(vehicleId) {
    setFavorites((c) =>
      c.includes(vehicleId) ? c.filter((id) => id !== vehicleId) : [...c, vehicleId]
    );
    // Sincroniza com back em background
    if (backendOnline) apiToggleFavorite(vehicleId).catch(() => {});
  }

  function addToProposal(vehicle) {
    setProposal((c) => {
      if (c.some((i) => i.id === vehicle.id)) {
        Alert.alert('Já adicionado', `${vehicle.name} já está na proposta.`);
        return c;
      }
      Alert.alert('✅ Adicionado', `${vehicle.name} foi adicionado à proposta.`);
      return [...c, vehicle];
    });
  }

  function removeFromProposal(vehicleId) {
    setProposal((c) => c.filter((i) => i.id !== vehicleId));
  }

  async function finishOrder() {
    const total = proposal.reduce((s, i) => s + i.price, 0);
    
    // Tenta criar negociação no back para cada veículo
    if (backendOnline) {
      for (const vehicle of proposal) {
        try {
          await apiStartNegotiation(vehicle.id);
        } catch (e) {}
      }
    }

    setOrders((c) => [{
      id: String(Date.now()).slice(-6),
      items: proposal,
      total,
      date: new Date().toLocaleDateString('pt-BR'),
    }, ...c]);
    setProposal([]);
    Alert.alert('🎉 Solicitação gerada!', 'A JLPG Motors entrará em contato para continuar a negociação.');
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
      if (backendOnline) {
        if (normalized.id && vehicles.find((v) => v.id === normalized.id)) {
          const updated = await apiUpdateVehicle(normalized.id, normalized);
          setVehicles((c) => c.map((v) => v.id === normalized.id ? { ...v, ...updated } : v));
        } else {
          const created = await apiCreateVehicle(normalized);
          setVehicles((c) => [created, ...c]);
        }
        return;
      }
    } catch (e) {}

    // Fallback local
    setVehicles((c) => {
      if (normalized.id && c.find((v) => v.id === normalized.id)) {
        return c.map((v) => v.id === normalized.id ? { ...v, ...normalized } : v);
      }
      return [{ ...normalized, id: String(Date.now()) }, ...c];
    });
  }

  async function deleteVehicle(vehicleId) {
    if (backendOnline) {
      try {
        await apiDeleteVehicle(vehicleId);
      } catch (e) {}
    }
    setVehicles((c) => c.filter((v) => v.id !== vehicleId));
    setFavorites((c) => c.filter((id) => id !== vehicleId));
    setProposal((c) => c.filter((v) => v.id !== vehicleId));
    setCompareVehicles((c) => c.filter((v) => v.id !== vehicleId));
    setRecentlyViewed((c) => c.filter((v) => v.id !== vehicleId));
  }

  function addRecentlyViewed(vehicle) {
    setRecentlyViewed((c) => [vehicle, ...c.filter((v) => v.id !== vehicle.id)].slice(0, 5));
  }

  function saveTestDrive(td) {
    setTestDrives((c) => [td, ...c]);
  }

  function updateTestDriveStatus(id, status) {
    setTestDrives((c) => c.map((td) => td.id === id ? { ...td, status } : td));
    const msg = status === 'approved' ? '✅ Test drive confirmado!' : '❌ Test drive recusado.';
    Alert.alert(msg, status === 'approved' ? 'O cliente será notificado.' : 'Agendamento cancelado.');
  }

  function addPriceAlert(alert) {
    setPriceAlerts((c) => {
      if (c.find((a) => a.vehicleId === alert.vehicleId)) {
        Alert.alert('Alerta já existe', 'Você já tem um alerta para este veículo.');
        return c;
      }
      Alert.alert('🔔 Alerta criado!', `Você será notificado quando ${alert.vehicleName} baixar para ${alert.targetPriceFormatted}.`);
      return [{ ...alert, id: String(Date.now()) }, ...c];
    });
  }

  function removePriceAlert(alertId) {
    setPriceAlerts((c) => c.filter((a) => a.id !== alertId));
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
