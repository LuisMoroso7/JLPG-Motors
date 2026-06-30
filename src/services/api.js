import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
const AUTH_STORAGE_KEY = '@jlpg-motors:auth';
const DEFAULT_CURRENCY = 'BRL';

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
  const authError = error?.response?.headers?.['x-auth-error'];
  if (authError) return authError;

  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (error?.code === 'ECONNABORTED') return 'Tempo de conexao esgotado. Verifique se o backend esta rodando.';
  if (error?.message === 'Network Error') return 'Nao foi possivel conectar ao backend.';
  return error?.message || fallbackMessage;
}

function setAuthToken(token) {
  authToken = token || null;
}

function mapUser(data) {
  return {
    id: data?.id ? String(data.id) : null,
    name: data?.name || data?.username || data?.email || 'Cliente',
    username: data?.username || data?.name || '',
    email: data?.email || '',
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

// STATUS / UTILS
export function apiGetBaseUrl() {
  return BASE_URL;
}

export async function apiGetGreeting() {
  try {
    const res = await api.get('/greeting');
    return res.data?.message || 'Bem-vindo ao JLPG Motors';
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel consultar o status do backend.'));
  }
}

export async function apiConvertCurrency({ source = DEFAULT_CURRENCY, target = 'USD', amount = 1 }) {
  try {
    const res = await api.get('/convert', {
      params: { source, target, amount },
    });
    return {
      source: res.data.source,
      target: res.data.target,
      amount: Number(res.data.amount ?? amount),
      rate: Number(res.data.rate ?? 1),
      convertedAmount: Number(res.data.convertedAmount ?? amount),
      rateDate: res.data.rateDate,
      fallback: Boolean(res.data.fallback),
    };
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel converter moeda.'));
  }
}

// VEHICLES / PRODUCTS
export async function apiGetVehicles(targetCurrency = DEFAULT_CURRENCY) {
  try {
    const res = await api.get('/products', { params: { targetCurrency } });
    return Array.isArray(res.data) ? res.data.map(mapVehicle) : [];
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel carregar os veiculos.'));
  }
}

export async function apiGetVehicleById(id, targetCurrency = DEFAULT_CURRENCY) {
  try {
    const res = await api.get(`/products/${id}`, { params: { targetCurrency } });
    return mapVehicle(res.data);
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel carregar os detalhes do veiculo.'));
  }
}

export async function apiCreateVehicle(vehicle) {
  try {
    const res = await api.post('/ws/product', mapVehicleToApi(vehicle));
    return mapVehicle(res.data);
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel cadastrar o veiculo.'));
  }
}

export async function apiUpdateVehicle(id, vehicle) {
  try {
    const res = await api.put(`/ws/product/${id}`, mapVehicleToApi(vehicle));
    return mapVehicle(res.data);
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel atualizar o veiculo.'));
  }
}

export async function apiDeleteVehicle(id) {
  try {
    await api.delete(`/ws/product/${id}`);
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel remover o veiculo.'));
  }
}

// ORDERS
export async function apiCreateOrder(vehicles, targetCurrency = DEFAULT_CURRENCY) {
  const items = vehicles.map((vehicle) => ({
    productId: vehicle.id,
    quantity: vehicle.quantity || 1,
  }));
  try {
    const res = await api.post('/ws/orders', { targetCurrency, items });
    return mapOrder(res.data, vehicles);
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel gerar o pedido.'));
  }
}

export async function apiGetOrders(currency = DEFAULT_CURRENCY) {
  try {
    const res = await api.get(`/ws/orders/${currency}`);
    return Array.isArray(res.data) ? res.data.map((order) => mapOrder(order)) : [];
  } catch (error) {
    throw new Error(normalizeError(error, 'Nao foi possivel carregar os pedidos.'));
  }
}

function mapVehicle(v) {
  const imageUrl = (v?.imageUrl || '').trim();
  const name = v?.name || [v?.brand, v?.model].filter(Boolean).join(' ');
  return {
    id: String(v?.id),
    name,
    brand: v?.brand || '',
    model: v?.model || '',
    year: Number(v?.yearModel ?? v?.year ?? 0),
    price: Number(v?.price ?? v?.basePrice ?? 0),
    basePrice: Number(v?.basePrice ?? v?.price ?? 0),
    baseCurrency: v?.baseCurrency || DEFAULT_CURRENCY,
    targetCurrency: v?.targetCurrency || DEFAULT_CURRENCY,
    km: Number(v?.mileage ?? v?.km ?? 0),
    transmission: v?.transmission || '',
    fuel: v?.fuelType || v?.fuel || '',
    category: v?.category || 'Outros',
    color: v?.color || '',
    stock: Number(v?.stock ?? 0),
    description: v?.description || '',
    image: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    plate: v?.plate || '',
    featured: Boolean(v?.featured),
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
    baseCurrency: v.baseCurrency || DEFAULT_CURRENCY,
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
    currency: item.currency || order.displayCurrency || order.currency || DEFAULT_CURRENCY,
  }));

  const fallbackTotal = sourceVehicles.reduce((sum, vehicle) => sum + Number(vehicle.price || 0), 0);
  const createdAt = order.createdAt || order.date || new Date().toISOString();

  return {
    id: String(order.id),
    status: order.status || 'CREATED',
    items: items.length > 0 ? items : sourceVehicles,
    total: Number(order.displayTotalAmount ?? order.totalAmount ?? fallbackTotal),
    currency: order.displayCurrency || order.currency || DEFAULT_CURRENCY,
    createdAt,
    date: new Date(createdAt).toLocaleDateString('pt-BR'),
  };
}

export default api;
