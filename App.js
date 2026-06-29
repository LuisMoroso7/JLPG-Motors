import React, { useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initialVehicles } from './src/data/vehicles';
import { darkColors, lightColors } from './src/theme/colors';

export default function App() {
  // Tema
  const [isDark, setIsDark] = useState(true);
  const colors = isDark ? darkColors : lightColors;
  function toggleTheme() { setIsDark((v) => !v); }

  // App state
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [favorites, setFavorites] = useState([]);
  const [proposal, setProposal] = useState([]);
  const [orders, setOrders] = useState([]);
  const [compareVehicles, setCompareVehicles] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);

  function finishOnboarding() { setShowOnboarding(false); }

  function toggleFavorite(vehicleId) {
    setFavorites((c) => c.includes(vehicleId) ? c.filter((id) => id !== vehicleId) : [...c, vehicleId]);
  }

  function addToProposal(vehicle) {
    setProposal((c) => {
      if (c.some((i) => i.id === vehicle.id)) { Alert.alert('Já adicionado', `${vehicle.name} já está na proposta.`); return c; }
      Alert.alert('✅ Adicionado', `${vehicle.name} foi adicionado à proposta.`);
      return [...c, vehicle];
    });
  }

  function removeFromProposal(vehicleId) { setProposal((c) => c.filter((i) => i.id !== vehicleId)); }

  function finishOrder() {
    const total = proposal.reduce((s, i) => s + i.price, 0);
    setOrders((c) => [{ id: String(Date.now()).slice(-6), items: proposal, total, date: new Date().toLocaleDateString('pt-BR') }, ...c]);
    setProposal([]);
    Alert.alert('🎉 Solicitação gerada!', 'A JLPG Motors entrará em contato para continuar a negociação.');
  }

  function saveVehicle(vehicle) {
    const normalized = { ...vehicle, price: Number(vehicle.price) || 0, km: Number(vehicle.km) || 0, stock: Number(vehicle.stock) || 1, year: Number(vehicle.year) || 2024, image: vehicle.image || '', images: vehicle.images || (vehicle.image ? [vehicle.image] : []), featured: vehicle.featured || false };
    setVehicles((c) => {
      if (normalized.id && c.find((v) => v.id === normalized.id)) return c.map((i) => i.id === normalized.id ? { ...i, ...normalized } : i);
      return [{ ...normalized, id: String(Date.now()) }, ...c];
    });
  }

  function deleteVehicle(vehicleId) {
    setVehicles((c) => c.filter((i) => i.id !== vehicleId));
    setFavorites((c) => c.filter((id) => id !== vehicleId));
    setProposal((c) => c.filter((i) => i.id !== vehicleId));
    setCompareVehicles((c) => c.filter((v) => v.id !== vehicleId));
    setRecentlyViewed((c) => c.filter((v) => v.id !== vehicleId));
    setPriceAlerts((c) => c.filter((a) => a.vehicleId !== vehicleId));
  }

  function addRecentlyViewed(vehicle) {
    setRecentlyViewed((c) => [vehicle, ...c.filter((v) => v.id !== vehicle.id)].slice(0, 5));
  }

  function saveTestDrive(td) { setTestDrives((c) => [td, ...c]); }

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

  function removePriceAlert(alertId) { setPriceAlerts((c) => c.filter((a) => a.id !== alertId)); }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator
        colors={colors}
        isDark={isDark}
        toggleTheme={toggleTheme}
        showOnboarding={showOnboarding}
        finishOnboarding={finishOnboarding}
        user={user}
        setUser={setUser}
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
        priceAlerts={priceAlerts}
        addPriceAlert={addPriceAlert}
        removePriceAlert={removePriceAlert}
        toggleFavorite={toggleFavorite}
        addToProposal={addToProposal}
        removeFromProposal={removeFromProposal}
        finishOrder={finishOrder}
        saveVehicle={saveVehicle}
        deleteVehicle={deleteVehicle}
      />
    </>
  );
}
