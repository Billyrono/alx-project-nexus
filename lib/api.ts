import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const getProducts = async (limit = 20, skip = 0) => {
  const response = await api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category: string) => {
  const response = await api.get<ProductsResponse>(`/products/category/${category}`);
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await api.get<ProductsResponse>(`/products/search?q=${query}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get<string[]>('/products/categories');
  return response.data;
};

export default api;
