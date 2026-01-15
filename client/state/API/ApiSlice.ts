import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { RootState } from "../store";

interface ApiState {
    registerResponse: RegisterResponse;
    loginResponse: LoginResponse;
    Product: Product[];
    CreateOrder: CreateOrder[];
    BuyerOrder: Order[];
    SellerOrder: Order[];
    loading: boolean;
    error: string | null;
    user: User | null;
    initialized?: boolean;
}

interface RegisterResponse {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    error?: string;
}



interface LoginResponse {
    token?: string;
    message?: string;
    error?: string;
    access_token?: string;
    isSeller?: boolean;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    category: string;
    sellerId?: number;
    createdAt: string;
}

export interface Order {
    id: number;
    product: {
            id: number
            title: string;
            price: number;
            description: string;
            category: string;
            seller: {
                id: number;
                name: string;
                phone: string;
                email: string;
                isSeller: boolean;
            }
        };
        buyer: {
            id: number;
            name: string;
            phone: string;
            email: string;
            isSeller: boolean;
        },
        quantity: number;
        createdAt: Date;
        status: string;
}

export interface User {
    UserId: string;
    name: string;
    email: string;
    phone?: number;
    isSeller?: boolean;
}

interface CreateOrder {
    productId: number;
    totalPrice: number;
    quantity: number;
    productQuantity: number;
}

const initialState: ApiState = {
    registerResponse: {
        message: "",
        user: { id: "", name: "", email: "" },
        error: "",
    },
    loginResponse: { token: "", message: "", error: "" },
    Product: [],
    CreateOrder: [],
    BuyerOrder: [],
    SellerOrder: [],
    loading: false,
    error: null,
    user: null,
    initialized: false,
};

// Login: send credentials, server sets cookie and returns token/message.
// After successful login we dispatch protectedRouteAsync to load the user into redux.
export const loginAsync = createAsyncThunk<
    LoginResponse,
    object,
    { rejectValue: string; dispatch: any }
>("loginAsync", async (data, { rejectWithValue, dispatch }) => {
    try {
        const loginResponse = await api.post("/auth/login", data, { withCredentials: true });
        // after successful login, fetch user info and store it
        dispatch(protectedRouteAsync());
        return loginResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

export const logoutAsync = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("logoutAsync", async (_, { rejectWithValue, dispatch }) => {
  try {
    await api.post("/auth/logout", { withCredentials: true });
    dispatch(clearUser()); // clear user immediately
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const registerAsync = createAsyncThunk<
    RegisterResponse,
    object,
    { rejectValue: string }
>("registerAsync", async (data, { rejectWithValue }) => {
    try {
        const registerResponse = await api.post("/auth/register", data, { withCredentials: true });
        return registerResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Register failed");
    }
});

// Protected route: ensures cookie is sent and returns user object
export const protectedRouteAsync = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>("protectedRouteAsync", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/auth/protected", { withCredentials: true });
        return response.data as User;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to access protected route");
    }
},
{
    condition: (_, { getState }) => {
        const { user, loading } = (getState() as RootState).api;
        // Skip if already initialized or currently loading
        return !user && !loading;
    },
});

export const pushNotificationSubscribeAsync = createAsyncThunk<
    void,
    object,
    { rejectValue: string }
>("pushNotificationSubscribeAsync", async (subscription, { rejectWithValue }) => {
    try {
        await api.post("/notification/subscribe", subscription, { withCredentials: true });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Push subscription failed");
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
        console.log("error trying to get all product in slice", error);
        return rejectWithValue(error.response?.data?.message || "Failed to get Products");
    }
});

export const addProductAsync = createAsyncThunk<
    Product,
    object,
    { rejectValue: string }
>("addProductAsync", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/product/create", data,
             { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Add product failed");
    }
});

export const editProductAsync = createAsyncThunk<
    Product,
    {product: Product, id: number},
    { rejectValue: string }
>("editProductAsync", async (data, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/product/update/${data.id}`, data.product,
             { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Edit product failed");
    }
});

export const deleteProductAsync = createAsyncThunk<
    {id: number},
    {id: number},
    { rejectValue: string }
>("deleteProductAsync", async (data, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/product/delete/${data.id}`,
             { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Delete product failed");
    }
});

export const getSellerProducts = createAsyncThunk<
    Product[],
    void,
    { rejectValue: string }
>("getSellerProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/product/getSellerProducts", { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get seller products");
    }
});

export const createOrderAsync = createAsyncThunk<
    CreateOrder,
    object,
    { rejectValue: string }
>("createOrderAsync", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/order/create", data,
             { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Place order failed");
    }
});

export const getBuyerOrdersAsync = createAsyncThunk<
    Order[],
    void,
    { rejectValue: string }
>("getBuyerOrdersAsync", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/order/getBuyerOrders", { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get buyer orders");
    }
});

export const getSellerOrdersAsync = createAsyncThunk<
    Order[],
    void,
    { rejectValue: string }
>("getSellerOrdersAsync", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/order/getSellerOrders", { withCredentials: true });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to get seller orders");
    }
});

export const updateOrderStatusAsync = createAsyncThunk<
    {orderId: number; status: string},
    {orderId: number; status: string},
    { rejectValue: string }
>("updateOrderStatusAsync", async (data, { rejectWithValue }) => {
    try {
        await api.put(`/order/updateStatus/${data.orderId}`, { status: data.status }, { withCredentials: true });
        return { orderId: data.orderId, status: data.status };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
});

const ApiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // login
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
                state.error = action.payload || action.error.message || "something went wrong";
            })

            .addCase(logoutAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.initialized = true;
                
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // register
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
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // protected route -> set user
            .addCase(protectedRouteAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(protectedRouteAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.initialized = true;
            })
            .addCase(protectedRouteAsync.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload || action.error.message || "something went wrong";
                state.initialized = true;
            })

            //notification
            .addCase(pushNotificationSubscribeAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(pushNotificationSubscribeAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(pushNotificationSubscribeAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // products
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
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // add product
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
                state.error = action.payload || action.error.message || "something went wrong";
            })

            //edit product
            .addCase(editProductAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editProductAsync.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.Product = state.Product.map(p => p.id === updated.id ? updated : p);
            })
            .addCase(editProductAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // delete product 
            .addCase(deleteProductAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductAsync.fulfilled, (state, action) => {
                state.loading = false;
                const { id } = action.payload;
                state.Product = state.Product.filter(product => product.id !== id);
            })
            .addCase(deleteProductAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            .addCase(getSellerProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSellerProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.Product = action.payload;
            })
            .addCase(getSellerProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // create order
            .addCase(createOrderAsync.pending, (state) =>{
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderAsync.fulfilled, (state, action) =>{
                state.loading = false;
                state.CreateOrder.push(action.payload);
            })
            .addCase(createOrderAsync.rejected, (state, action) =>{
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // get buyer orders
            .addCase(getBuyerOrdersAsync.pending, (state) =>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getBuyerOrdersAsync.fulfilled, (state, action) =>{
                state.loading = false;
                state.BuyerOrder = action.payload;
            })
            .addCase(getBuyerOrdersAsync.rejected, (state, action) =>{
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            // get seller orders
            .addCase(getSellerOrdersAsync.pending, (state) =>{
                state.loading = true;
                state.error = null;
            })
            .addCase(getSellerOrdersAsync.fulfilled, (state, action) =>{
                state.loading = false;
                state.SellerOrder = action.payload;
            })
            .addCase(getSellerOrdersAsync.rejected, (state, action) =>{
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            })

            .addCase(updateOrderStatusAsync.pending, (state) =>{
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatusAsync.fulfilled, (state, action) =>{
                state.loading = false;
                const { orderId, status } = action.payload;
                // Update status in BuyerOrder
                // const buyerOrder = state.BuyerOrder.find(order => order.id === orderId);
                // console.log("Buyer order to update:", buyerOrder);
                // if (buyerOrder) {
                //     buyerOrder.status = status;
                // }
                // Update status in SellerOrder
                // const sellerOrder = state.SellerOrder.find(order => order.id === orderId);
                // console.log("Seller order to update:", sellerOrder);
                // if (sellerOrder) {
                //     sellerOrder.status = status;
                // }
            })
            .addCase(updateOrderStatusAsync.rejected, (state, action) =>{
                state.loading = false;
                state.error = action.payload || action.error.message || "something went wrong";
            });
    },
});

export const { setUser, clearUser, clearError } = ApiSlice.actions;
export default ApiSlice.reducer;

// selector helper (use in components to read user)
export const selectUser = (state: any) => state.api.user;
export const selectIsAuthenticated = (state: any) => !!state.api.user;
