"use client";
import React, { useState } from "react";
import Image from "next/image";

//Redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { createOrderAsync } from "@/state/API/ApiSlice";
import { makeEmpty } from "@/state/cart/cartSlice";

const Receipt = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartProducts = useSelector((state: RootState) => state.cart.items);

  const handleClick = async () => {
    try {
      const data = {
        items: cartProducts.map((item) => ({
          productId: item.product.id,
          quantity: item.cartQuantity,
          totalPrice: item.product.price * item.cartQuantity,
          productQuantity: item.product.quantity,
        })),
      };
      await dispatch(createOrderAsync(data.items)).unwrap();
      dispatch(makeEmpty());
      alert("success");
    } catch (error) {
      console.log(error);
      alert("error please check console");
    }
  };
  return (
    <div className="w-[30%] bg-white p-4 rounded-xl shadow-lg">
      <div className="w-[95%] text-center">
        <p className="font-semibold text-2xl tracking-widest">
          ----------------------------------------
        </p>
        <p className="font-semibold text-2xl tracking-widest">
          ----------------------------------------
        </p>
        <h2 className="text-3xl font-bold mb-4">Receipt</h2>
        <p className="font-semibold text-2xl tracking-widest">
          ----------------------------------------
        </p>
        <p className="font-semibold text-2xl tracking-widest">
          ----------------------------------------
        </p>
        {cartProducts.map((item, index) => (
          <div key={index} className="flex mb-4 mx-8 justify-between">
            <p className="">
              {item.product?.title} x{item.cartQuantity}
            </p>
            <p>${item.product?.price * item.cartQuantity}</p>
          </div>
        ))}
        <p className="font-semibold text-2xl tracking-widest">
          ---------------------------------------------
        </p>

        <div className="text-xl font-bsemiold flex justify-between mx-8 my-4">
          <div>Total Amount:</div>
          {cartProducts.reduce((total, item) => {
            return (
              total +
              (item.product ? item.product.price * item.cartQuantity : 0)
            );
          }, 0)}{" "}
          Birr
        </div>
        <p className="font-semibold text-2xl tracking-widest">
          ---------------------------------------------
        </p>
        <h1 className="text-4xl font-bold my-6">Thank you!!!</h1>
        <p className="font-semibold text-2xl tracking-widest">
          ---------------------------------------------
        </p>
        <div className="flex justify-center">
          <Image
            src="https://docs.huihoo.com/odoo/user/10.0/fr/_images/receipts02.png"
            alt="barcode"
            width={300}
            height={150}
          />
        </div>
        <button
          onClick={() => handleClick()}
          className="mt-3 py-3 w-full bg-[rgb(56,177,151)] text-white font-bold rounded-xl"
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default Receipt;
