import axios from 'axios';

const BASE_URL = 'https://jlpg-motors-backend.onrender.com';

let authToken = null;
let currentUserId = null;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// AUTH
export async function apiLogin(email, password) {
  const res = await api.post('/auth-service/auth/login', { email, password });
  authToken = res.data.token;
  currentUserId = res.data.id;
  return res.data;
}

export async function apiRegister({ username, email, password }) {
  const res = await api.post('/auth-service/auth/register', { username, email, password, role: 'USER' });
  return res.data;
}

export function apiLogout() {
  authToken = null;
  currentUserId = null;
}

// VEHICLES
export async function apiGetVehicles() {
  const res = await api.get('/vehicle-service/vehicles');
  return res.data.map(mapVehicle);
}

export async function apiCreateVehicle(vehicle) {
  const res = await api.post('/vehicle-service/vehicles', mapVehicleToApi(vehicle));
  return mapVehicle(res.data);
}

export async function apiUpdateVehicle(id, vehicle) {
  const res = await api.put(`/vehicle-service/vehicles/${id}`, mapVehicleToApi(vehicle));
  return mapVehicle(res.data);
}

export async function apiDeleteVehicle(id) {
  await api.delete(`/vehicle-service/vehicles/${id}`);
}

// FAVORITES
export async function apiToggleFavorite(vehicleId) {
  const res = await api.post(`/customer-service/favorites/${vehicleId}`);
  return res.data;
}

export async function apiGetFavorites() {
  const res = await api.get('/customer-service/favorites');
  return res.data;
}

// NEGOTIATIONS
export async function apiStartNegotiation(vehicleId) {
  const res = await api.post(`/customer-service/negotiations/${vehicleId}`);
  return res.data;
}

export async function apiGetMyNegotiations() {
  const res = await api.get('/customer-service/negotiations/my-chats');
  return res.data;
}

export async function apiGetAllNegotiations() {
  const res = await api.get('/customer-service/negotiations/admin/all');
  return res.data;
}

export async function apiCloseNegotiation(chatId) {
  const res = await api.put(`/customer-service/negotiations/${chatId}/close`);
  return res.data;
}

// Mapeia campos do back para o front
function mapVehicle(v) {
  return {
    id: v.id,
    name: v.name,
    brand: v.brand,
    model: v.model,
    year: v.yearModel,
    price: Number(v.price),
    km: v.mileage,
    transmission: v.transmission,
    fuel: v.fuelType,
    category: v.category,
    color: v.color,
    stock: v.stock,
    description: v.description || '',
    image: v.imageUrl || '',
    images: v.imageUrl ? [v.imageUrl] : [],
    plate: v.plate,
    featured: false,
  };
}

function mapVehicleToApi(v) {
  return {
    name: v.name,
    brand: v.brand,
    model: v.model,
    yearModel: Number(v.year),
    price: Number(v.price),
    mileage: Number(v.km),
    transmission: v.transmission,
    fuelType: v.fuel,
    category: v.category,
    color: v.color,
    stock: Number(v.stock),
    description: v.description || '',
    imageUrl: v.image || '',
    plate: v.plate || `JP${Date.now().toString().slice(-6)}`,
  };
}

export default api;
