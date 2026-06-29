import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
const AUTH_STORAGE_KEY = '@jlpg-motors:auth';

let authToken = null;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

function normalizeError(error, fallbackMessage) {
  const message = error?.response?.data;
  if (typeof message === 'string' && message.trim()) return message;
  return error?.message || fallbackMessage;
}

function setAuthToken(token) {
  authToken = token || null;
}

function mapUser(data) {
  return {
    id: data.id,
    name: data.username,
    username: data.username,
    email: data.email,
    role: data.role === 'ADMIN' ? 'ADMIN' : 'USER',
  };
}

async function persistSession(data) {
  const user = mapUser(data);
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: data.token, user }));
  return user;
}

export async function apiLoadSession() {
  const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    if (!session?.token || !session?.user) return null;
    setAuthToken(session.token);
    return session.user;
  } catch (e) {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

// AUTH
export async function apiLogin(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    setAuthToken(res.data.token);
    const user = await persistSession(res.data);
    return { ...res.data, user };
  } catch (error) {
    throw new Error(normalizeError(error, 'Usuario ou senha invalidos.'));
  }
}

export async function apiRegister({ username, email, password }) {
  try {
    const res = await api.post('/auth/register', { username, email, password, role: 'USER' });
    return res.data;
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel criar o cadastro.'));
  }
}

export async function apiLogout() {
  setAuthToken(null);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

// VEHICLES / PRODUCTS
export async function apiGetVehicles() {
  const res = await api.get('/products', { params: { targetCurrency: 'BRL' } });
  return res.data.map(mapVehicle);
}

export async function apiCreateVehicle(vehicle) {
  const res = await api.post('/ws/product', mapVehicleToApi(vehicle));
  return mapVehicle(res.data);
}

export async function apiUpdateVehicle(id, vehicle) {
  const res = await api.put(`/ws/product/${id}`, mapVehicleToApi(vehicle));
  return mapVehicle(res.data);
}

export async function apiDeleteVehicle(id) {
  await api.delete(`/ws/product/${id}`);
}

// ORDERS
export async function apiCreateOrder(vehicles, targetCurrency = 'BRL') {
  const items = vehicles.map((vehicle) => ({
    productId: vehicle.id,
    quantity: vehicle.quantity || 1,
  }));
  const res = await api.post('/ws/orders', { targetCurrency, items });
  return mapOrder(res.data, vehicles);
}

export async function apiGetOrders(currency = 'BRL') {
  const res = await api.get(`/ws/orders/${currency}`);
  return res.data.map((order) => mapOrder(order));
}

// Legacy customer-service endpoints are intentionally disabled in the current
// backend architecture. Keep these exports so older screens can fall back local.
export async function apiGetAllNegotiations() {
  throw new Error('customer-service legado nao esta roteado pelo gateway.');
}

export async function apiCloseNegotiation() {
  throw new Error('customer-service legado nao esta roteado pelo gateway.');
}

function mapVehicle(v) {
  const imageUrl = v.imageUrl || '';
  return {
    id: String(v.id),
    name: v.name,
    brand: v.brand,
    model: v.model,
    year: v.yearModel,
    price: Number(v.price ?? v.basePrice ?? 0),
    basePrice: Number(v.basePrice ?? v.price ?? 0),
    baseCurrency: v.baseCurrency || 'BRL',
    targetCurrency: v.targetCurrency || 'BRL',
    km: v.mileage,
    transmission: v.transmission,
    fuel: v.fuelType,
    category: v.category,
    color: v.color,
    stock: v.stock,
    description: v.description || '',
    image: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    plate: v.plate,
    featured: false,
  };
}

function mapVehicleToApi(v) {
  const plate = v.plate?.trim().toUpperCase() || `JP${Date.now().toString().slice(-6)}`;
  return {
    name: v.name?.trim(),
    brand: v.brand?.trim(),
    model: v.model?.trim(),
    yearModel: Number(v.year),
    price: Number(v.price),
    baseCurrency: 'BRL',
    mileage: Number(v.km),
    transmission: v.transmission,
    fuelType: v.fuel,
    category: v.category,
    color: v.color,
    stock: Number(v.stock),
    description: v.description || '',
    imageUrl: v.image?.trim() || '',
    plate,
  };
}

function mapOrder(order, sourceVehicles = []) {
  const items = (order.items || []).map((item) => ({
    id: String(item.productId),
    name: item.productName,
    quantity: item.quantity,
    price: Number(item.totalPrice ?? item.unitPrice ?? 0),
    currency: item.currency || order.displayCurrency || order.currency || 'BRL',
  }));

  const fallbackTotal = sourceVehicles.reduce((sum, vehicle) => sum + Number(vehicle.price || 0), 0);

  return {
    id: String(order.id),
    status: order.status || 'CREATED',
    items: items.length > 0 ? items : sourceVehicles,
    total: Number(order.displayTotalAmount ?? order.totalAmount ?? fallbackTotal),
    currency: order.displayCurrency || order.currency || 'BRL',
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
  };
}

export default api;
