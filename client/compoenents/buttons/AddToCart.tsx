"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

import { decrement, increment } from "@/state/cart/cartSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";

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

const AddToCart = ({
  product,
  position,
}: {
  product: Product;
  position: string;
}) => {
  const item = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.product.id === product.id)
  );

  const quantity = item ? item.cartQuantity : 0;

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div>
      {quantity === 0 ? (
        <button
          onClick={() => dispatch(increment(product))}
          className="mt-3 py-3 w-full bg-[rgb(56,177,151)] text-white font-bold rounded-xl"
        >
          Add to Cart
        </button>
      ) : (
        <div
          className={`${
            position === "horizontal"
              ? "flex gap-10 justify-center align-center"
              : "flex flex-col gap-2 justify-center align-center"
          } w-full  my-3 text-xl`}
        >
          <button
            className="text-2xl border px-3"
            onClick={() => dispatch(decrement(product))}
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            className="border px-3"
            onClick={() => dispatch(increment(product))}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
