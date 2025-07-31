import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from '@/lib/api';

interface ApiState {
    registerResponse: RegisterResponse,
    loginResponse: LoginResponse,
    loading: boolean,
    error: string | null;
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
    token: string,
    message: string,
   error: string
}

const initialState: ApiState = {
    registerResponse: {message: "", user: { id: "", name: "", email: "" }, error: ""},
    loginResponse: { token: "", message: "", error: ""},
    loading: false,
    error: null
}

export const fetchAsync = createAsyncThunk<LoginResponse, object, { rejectValue: string }>(
    'fetchAsync',
    async (data, { rejectWithValue }) => {
        try{
            const loginResponse = await api.post('/auth/login', data);
            return loginResponse.data

        } catch(error: any){
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    })

    export const registerAsync = createAsyncThunk<RegisterResponse, object, { rejectValue: string }>(
        'registerAsync',
        async (data, { rejectWithValue }) => {
            try{
                const registerResponse = await api.post('/auth/register', data);
                return registerResponse.data
            } catch(error: any){
                return rejectWithValue(error.response?.data?.message || "Register failed");
            }
        })

const ApiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(fetchAsync.pending, (state) =>{
            state.loading = true
            state.error = null;
        }).addCase(fetchAsync.fulfilled, (state, action) => {
            state.loading = false;
            state.loginResponse = action.payload
        }).addCase(fetchAsync.rejected, (state, action) =>{
            state.loading = false;
            state.error = action.error.message || "something went wrong"
        }),
        builder.addCase(registerAsync.pending, (state) =>{
            state.loading = true
            state.error = null;
        }).addCase(registerAsync.fulfilled, (state, action) => {
            state.loading = false;
            state.registerResponse = action.payload
        }).addCase(registerAsync.rejected, (state, action) =>{
            state.loading = false;
            state.error = action.error.message || "something went wrong"
        })
    }
})

export default ApiSlice.reducer;

