import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
    description?: string;
}

interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isOpen: false,
};

// Helper to load from localStorage
const loadCartFromStorage = (): CartState => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cart');
        if (saved) return JSON.parse(saved);
    }
    return initialState;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromStorage(),
    reducers: {
        toggleCart(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload;
        },
        addToCart(state, action: PayloadAction<CartItem>) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push({ ...newItem, quantity: 1 });
            } else {
                existingItem.quantity++;
            }

            state.totalQuantity++;
            state.totalAmount += newItem.price;
            state.isOpen = true;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart(state, action: PayloadAction<number>) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.price * existingItem.quantity;
                state.items = state.items.filter((item) => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },
        updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);

            if (item && quantity > 0) {
                const diff = quantity - item.quantity;
                item.quantity = quantity;
                state.totalQuantity += diff;
                state.totalAmount += item.price * diff;
                localStorage.setItem('cart', JSON.stringify(state));
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            localStorage.removeItem('cart');
        }
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
