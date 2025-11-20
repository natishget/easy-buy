import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api";

interface ApiState {
    registerResponse: RegisterResponse;
    loginResponse: LoginResponse;
    Product: Product[];
    loading: boolean;
    error: string | null;
    user: User | null;
}

interface RegisterResponse {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    error: string;
}

interface LoginResponse {
    token: string;
    message: string;
    error: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    category: string;
    sellerId: number;
    createdAt: string;
}

interface User {
    UserId: string;
    name: string;
    email: string;
    phone: number;
    isSeller: boolean;
}

const initialState: ApiState = {
    registerResponse: {
        message: "",
        user: { id: "", name: "", email: "" },
        error: "",
    },
    loginResponse: { token: "", message: "", error: "" },
    Product: [],
    loading: false,
    error: null,
    user: null,
};

export const loginAsync = createAsyncThunk<
    LoginResponse,
    object,
    { rejectValue: string }
>("loginAsync", async (data, { rejectWithValue }) => {
    try {
        const loginResponse = await api.post("/auth/login", data);
        return loginResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

export const registerAsync = createAsyncThunk<
    RegisterResponse,
    object,
    { rejectValue: string }
>("registerAsync", async (data, { rejectWithValue }) => {
    try {
        const registerResponse = await api.post("/auth/register", data);
        return registerResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Register failed");
    }
});

export const protectedRouteAsync = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>("protectedRouteAsync", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/auth/protected");
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to access protected route"
        );
    }
});

export const getAllProducts = createAsyncThunk<
    Product[],
    void,
    { rejectValue: string }
>("getAllProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/product/get");
        return response.data;
    } catch (error: any) {
        console.log("error trying to get all product in slice", error)
        return rejectWithValue(
            error.reponse?.data?.message || "Failed to get Products"
        );
    }
});

export const addProductAsync = createAsyncThunk<
    Product,
    object,
    { rejectValue: string }
>("addProductAsync", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/product/create", data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Add product failed");
    }
});

const ApiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.loginResponse = action.payload;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "something went wrong";
            }),
            builder
                .addCase(registerAsync.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(registerAsync.fulfilled, (state, action) => {
                    state.loading = false;
                    state.registerResponse = action.payload;
                })
                .addCase(registerAsync.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message || "something went wrong";
                }),
            builder
                .addCase(protectedRouteAsync.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(protectedRouteAsync.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload;
                })
                .addCase(protectedRouteAsync.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message || "something went wrong";
                }),
            builder
                .addCase(getAllProducts.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(getAllProducts.fulfilled, (state, action) => {
                    state.loading = false;
                    state.Product = action.payload;
                })
                .addCase(getAllProducts.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message || "something went wrong";
                });
        builder
            .addCase(addProductAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.Product.push(action.payload);
            })
            .addCase(addProductAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "something went wrong";
            });
    },
});

export default ApiSlice.reducer;
