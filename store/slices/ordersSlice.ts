import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

interface ShippingDetails {
    fullName: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    country: string;
    postalCode: string;
}

export interface Order {
    id: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    total: number;
    shippingDetails: ShippingDetails;
    paymentMethod: string;
    userId?: string;
}

interface OrdersState {
    orders: Order[];
}

const initialState: OrdersState = {
    orders: [],
};

const loadOrdersFromStorage = (): OrdersState => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('orders');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse orders from localStorage", e);
            }
        }
    }
    return initialState;
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState: loadOrdersFromStorage(),
    reducers: {
        addOrder(state, action: PayloadAction<Order>) {
            state.orders.unshift(action.payload); // Add new order to the beginning
            localStorage.setItem('orders', JSON.stringify(state));
        },
        updateOrderStatus(state, action: PayloadAction<{ id: string; status: Order['status'] }>) {
            const { id, status } = action.payload;
            const order = state.orders.find((o) => o.id === id);
            if (order) {
                order.status = status;
                localStorage.setItem('orders', JSON.stringify(state));
            }
        },
        clearOrders(state) {
            state.orders = [];
            localStorage.removeItem('orders');
        }
    },
});

export const { addOrder, updateOrderStatus, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
