import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    image: string;
    token: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            // Intercept Billy's demo credentials and use a valid DummyJSON user
            let apiCredentials = credentials;
            if (credentials.username === 'billyr' && credentials.password === 'billydev') {
                apiCredentials = { username: 'emilys', password: 'emilyspass' };
            }

            const response = await axios.post('https://dummyjson.com/auth/login', apiCredentials, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        loadUserFromStorage(state) {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                if (token && user) {
                    state.token = token;
                    state.user = JSON.parse(user);
                    state.isAuthenticated = true;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;

                // Override with Kenyan name as requested
                const user = { ...action.payload, firstName: 'Billy', lastName: 'Rono', username: 'billyr', email: 'billy@nexamart.com' };

                state.user = user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
