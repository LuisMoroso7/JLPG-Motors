import React, { useState } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { initialVehicles } from './src/data/vehicles';

export default function App() {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [favorites, setFavorites] = useState([]);
  const [proposal, setProposal] = useState([]);
  const [orders, setOrders] = useState([]);

  function toggleFavorite(vehicleId) {
    setFavorites((current) =>
      current.includes(vehicleId) ? current.filter((id) => id !== vehicleId) : [...current, vehicleId]
    );
  }

  function addToProposal(vehicle) {
    setProposal((current) => {
      if (current.some((item) => item.id === vehicle.id)) return current;
      Alert.alert('Adicionado', `${vehicle.name} foi adicionado à proposta.`);
      return [...current, vehicle];
    });
  }

  function removeFromProposal(vehicleId) {
    setProposal((current) => current.filter((item) => item.id !== vehicleId));
  }

  function finishOrder() {
    const total = proposal.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
      id: String(Date.now()).slice(-6),
      items: proposal,
      total,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setOrders((current) => [newOrder, ...current]);
    setProposal([]);
    Alert.alert('Solicitação gerada', 'A JLPG Motors entrará em contato para continuar a negociação.');
  }

  function saveVehicle(vehicle) {
  const normalizedVehicle = {
    ...vehicle,
    price: Number(vehicle.price) || 0,
    km: Number(vehicle.km) || 0,
    stock: Number(vehicle.stock) || 1,
    year: String(vehicle.year || '2024'),
    image: vehicle.image || ''
  };

  setVehicles((current) => {
    if (normalizedVehicle.id) {
      return current.map((item) =>
        item.id === normalizedVehicle.id ? { ...item, ...normalizedVehicle } : item
      );
    }

    return [{ ...normalizedVehicle, id: String(Date.now()) }, ...current];
  });
}

  function deleteVehicle(vehicleId) {
    setVehicles((current) => current.filter((item) => item.id !== vehicleId));
    setFavorites((current) => current.filter((id) => id !== vehicleId));
    setProposal((current) => current.filter((item) => item.id !== vehicleId));
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator
        user={user}
        setUser={setUser}
        vehicles={vehicles}
        favorites={favorites}
        proposal={proposal}
        orders={orders}
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
