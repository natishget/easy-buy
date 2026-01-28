"use client";
import React, { useState } from "react";

import { decrement, increment } from "@/state/cart/cartSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";

import { Product } from "@/state/API/ApiSlice";
import ErrorAlert from "../alerts/ErrorAlert";
import { set } from "zod";

const AddToCart = ({
  product,
  position,
}: {
  product: Product;
  position: string;
}) => {
  const item = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.product.id === product.id),
  );
  const [showError, setShowError] = useState(false);

  const quantity = item ? item.cartQuantity : 0;

  const handleAdd = () => {
    if (product.quantity !== 0) {
      dispatch(increment(product));
    } else {
      // show alert (state-driven)
      setShowError(true);
    }
  };

  const handleDecrement = () => {
    if (product.quantity !== 0) {
      dispatch(decrement(product));
    } else {
      // show alert (state-driven)
      setShowError(true);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div>
      {quantity === 0 ? (
        product.quantity === 0 ? (
          <ErrorAlert
            alertName="Out of Stock"
            description="This product is currently out of stock."
          />
        ) : (
          <button
            onClick={handleAdd}
            className="mt-3 py-3 w-full bg-[rgb(56,177,151)] text-white font-bold rounded-xl"
          >
            Add to Cart
          </button>
        )
      ) : (
        <div
          className={`${
            position === "horizontal"
              ? "flex gap-10 justify-center items-center"
              : "flex flex-col gap-2 justify-center items-center"
          } w-full  my-3 text-xl`}
        >
          <button
            className={`text-2xl border px-3 hover:bg-teal-500  hover:border-teal-500 hover:text-white hover:text-bold ${
              position !== "horizontal" ? "rounded-full" : ""
            }`}
            onClick={handleDecrement}
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            className={`text-2xl border px-3 hover:bg-teal-500  hover:border-teal-500 hover:text-white hover:text-bold ${
              position !== "horizontal" ? "rounded-full" : ""
            }`}
            onClick={handleAdd}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
