"use client";
import React from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import Image from "next/image";
import AddToCart from "@/compoenents/buttons/AddToCart";

const CartComponent = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.items);

  return (
    <div className="w-[60%] flex flex-col gap-10">
      {cartProducts.map((product, index) => {
        return (
          <div
            className="w-[900px] border border-gray-100 bg-white  shadow-2xl rounded-xl"
            key={index}
          >
            <div className="w-fit flex gap-5 justify-center items-center">
              <Image
                src={product.product?.imageUrl || "/placeholder.jpg"}
                alt="product image"
                className="rounded-xl aspect-square object-cover"
                width={150}
                height={100}
                align-centert={100}
              />
              <AddToCart product={product.product} position="vertical" />
              <div className="flex text-xl gap-10 h-full justify-center items-center my-10 mx-3">
                <p className="text-gray-500 px-10">{product.product?.title}</p>
                <h1 className=" font-bold">
                  Unit Price:{" "}
                  <span className="text-teal-500">
                    ${product.product.price}
                  </span>{" "}
                </h1>
                <p className="font-bold">
                  Avaliable Quantity:{" "}
                  {product.product.quantity === 0 ? (
                    <span className="text-red-700">Out of Stock</span>
                  ) : (
                    <span className="text-teal-500">
                      {product.product.quantity}
                    </span>
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
