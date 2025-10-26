"use client";
import React from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import Image from "next/image";
import AddToCart from "@/compoenents/buttons/AddToCart";

const CartComponent = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.items);

  return (
    <div>
      {cartProducts.map((product, index) => {
        return (
          <div
            className="border border-gray-100 w-fit shadow-2xl rounded-xl"
            key={index}
          >
            <div className="flex justify-center align-center">
              <Image
                src={product.product?.imageUrl}
                alt="product image"
                className="rounded-xl aspect-square object-cover"
                width={100}
                align-centert={100}
              />
              <AddToCart product={product.product} position="vertical" />
              <div className="flex text-xl gap-20 h-full justify-center align-center">
                <p className="text-gray-500 px-10">{product.product?.title}</p>
                <h1 className=" font-bold">
                  Price: {product.product.price}Birr
                </h1>
                <p className="font-bold">
                  Quantity:{" "}
                  {product.product.quantity === 0 ? (
                    <span className="text-red-700">Out of Stock</span>
                  ) : (
                    <span className="text-teal-500">10</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartComponent;
