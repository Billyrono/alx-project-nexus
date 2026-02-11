import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
}

interface WishlistState {
    items: WishlistItem[];
}

const initialState: WishlistState = {
    items: [],
};

const loadWishlistFromStorage = (): WishlistState => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('wishlist');
        if (saved) return JSON.parse(saved);
    }
    return initialState;
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: loadWishlistFromStorage(),
    reducers: {
        addToWishlist(state, action: PayloadAction<WishlistItem>) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            if (!existingItem) {
                state.items.push(newItem);
                localStorage.setItem('wishlist', JSON.stringify(state));
            }
        },
        removeFromWishlist(state, action: PayloadAction<number>) {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        clearWishlist(state) {
            state.items = [];
            localStorage.removeItem('wishlist');
        }
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
