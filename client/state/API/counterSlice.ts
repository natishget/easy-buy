import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface counterState {
    value: number,
}

const initialState: counterState = {
    value: 0
}

const CounterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByNumber: (state, action: PayloadAction<number>) =>{
            state.value += action.payload;
        },
        decrementByNumber: (state, action: PayloadAction<number>) =>{
            state.value -= action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(incrementAsync.pending, () =>{
            console.log("IncrementAynce Pending")
        }).addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) =>{
            state.value += action.payload
        })
    }
});

export const incrementAsync = createAsyncThunk(
    'counter/incrementAsync',
    async (amount: number) =>{
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return amount
    }
)

export const {increment, decrement, incrementByNumber, decrementByNumber} =CounterSlice.actions;
export default CounterSlice.reducer;