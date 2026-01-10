"use client";

import React from "react";
import OrderDialog from "../dialog/OrderDialog";

import type { Order } from "@/state/API/ApiSlice";

type Props = { orderData: Order };

const OrderCard = ({ orderData }: Props) => {
  const names = orderData.product.seller.name.split(" ");

  // 2. Initialize a variable for the initials
  let initials = "";

  if (names.length > 0) {
    initials += names[0].charAt(0);

    if (names.length > 1) {
      // Get the first letter of the last word (e.g., 'N')
      // words.length - 1 points to the last element in the array
      initials += names[names.length - 1].charAt(0);
    }
  }
  initials = initials.toUpperCase();

  return (
    <div
      className={`m-5 text-lg text-gray-700 border border-gray-300 rounded-xl p-5 shadow-2xl bg-white w-[400px] ${
        orderData.status === "pending"
          ? "border-b-6 border-b-orange-500"
          : orderData.status === "delivering"
          ? "border-b-6 border-b-blue-500"
          : orderData.status === "sold"
          ? "border-b-6 border-b-green-500"
          : "border-b-6 border-b-red-600"
      }`}
    >
      <div className="flex gap-3 mt-5 mb-8 text-gray-600 text-xl">
        <h1 className="font-semibold">#{orderData.id}</h1>
        <p>|</p>
        <p>{new Date(orderData.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="text-lg mb-8">
        <h1 className="font-bold">{orderData.product.title}</h1>
        <p className="text-gray-500">{orderData.product.description}</p>
      </div>

      <div className="flex justify-between items-center mb-8 text-gray-600">
        <div>
          <p className="font-bold">Quantity</p>
          <p>{orderData.quantity}</p>
        </div>
        <div>
          <p className="font-bold">$Unit Price</p>
          <p>${orderData.product.price}</p>
        </div>
        <div>
          <p className="font-bold">Total Price</p>
          <p>${orderData.product.price * orderData.quantity}</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t-2 border-t-gray-300 pt-5">
        <div className="flex gap-3 items-center">
          <div className="p-3 bg-teal-600 rounded-full font-bold text-white w-[50px] h-[50px] flex items-center justify-center">
            {initials}
          </div>
          <p className="font-semibold text-gray-900">
            {orderData.product.seller.name}
          </p>
        </div>

        <OrderDialog orderData={orderData} />
      </div>
    </div>
  );
};

export default OrderCard;
