import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface CartItem {
    product: Product,
    cartQuantity: number
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};


const CartSlice = createSlice({
    name: "CartSlice",
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<Product>) => {
            const it = state.items.find((item) => item.product.id === action.payload.id)
            if (it) {
                if (it.product.quantity > it.cartQuantity)
                    it.cartQuantity += 1;
            }
            else
                state.items.push({ product: action.payload, cartQuantity: 1 })
        },
        decrement: (state, action: PayloadAction<Product>) => {
            const product = state.items.find((item) => item.product.id === action.payload.id);
            if (product && product.cartQuantity > 1) {
                product.cartQuantity -= 1;
            } else {
                state.items = state.items.filter((item) => item.product.id !== action.payload.id);
            }
        },
        makeEmpty: (state) => {
            state.items = [];
        }
    }
});

export const { increment, decrement, makeEmpty } = CartSlice.actions;
export default CartSlice.reducer;