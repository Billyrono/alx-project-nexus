import axios from 'axios';

const API_URL = 'https://dummyjson.com';

export const apiFn = axios.create({
    baseURL: API_URL,
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
    sku?: string;
    weight?: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: {
        rating: number;
        comment: string;
        date: string;
        reviewerName: string;
        reviewerEmail: string;
    }[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    meta?: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
}

export interface Category {
    slug: string;
    name: string;
    url: string;
}

export const api = {
    getProducts: async () => {
        const response = await apiFn.get<{ products: Product[], total: number, skip: number, limit: number }>('/products?limit=100');
        return response.data;
    },
    getProduct: async (id: number) => {
        const response = await apiFn.get<Product>(`/products/${id}`);
        return response.data;
    },
    searchProducts: async (query: string) => {
        const response = await apiFn.get<{ products: Product[], total: number, skip: number, limit: number }>(`/products/search?q=${query}`);
        return response.data;
    },
    getCategories: async () => {
        const response = await apiFn.get<Category[]>('/products/categories');
        return response.data;
    },
    getProductsByCategory: async (category: string) => {
        const response = await apiFn.get<{ products: Product[], total: number, skip: number, limit: number }>(`/products/category/${category}`);
        return response.data;
    }
};
