"use client";
import React from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import Image from "next/image";
import AddToCart from "@/compoenents/buttons/AddToCart";

const CartProductCard = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.items);

  return (
    <div>
      {cartProducts.map((product, index) => {
        return (
          <div
            className="border border-white-100 bg-white w-fit shadow-2xl rounded-xl"
            key={product.product.id}
          >
            <div>
              <Image
                src={product.product?.imageUrl}
                alt="product image"
                className="rounded-xl aspect-square object-cover"
                width={300}
                height={100}
              />
              <h1 className="mt-3 font-bold pl-3">
                Price: {product.product.price}Birr
              </h1>
              <p className="text-gray-500 pl-3">{product.product?.title}</p>
              <p className="pl-3 font-bold">
                Quantity:{" "}
                {product.product.quantity === 0 ? (
                  <span className="text-red-700">Out of Stock</span>
                ) : (
                  <span className="text-teal-500">10</span>
                )}
              </p>
            </div>
            <AddToCart product={product.product} position="vertical" />
          </div>
        );
      })}
    </div>
  );
};

export default CartProductCard;
