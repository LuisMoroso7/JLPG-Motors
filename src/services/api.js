import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const endpoints = {
  signin: '/auth/signin',
  signup: '/auth/signup',
  products: '/products?targetCurrency=BRL',
  productById: (id) => `/products/${id}?targetCurrency=BRL`,
  createProduct: '/ws/product',
  updateProduct: (id) => `/ws/product/${id}`,
  deleteProduct: (id) => `/ws/product/${id}`,
  createOrder: '/ws/orders',
  orders: '/ws/orders/BRL'
};
