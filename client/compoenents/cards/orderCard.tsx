"use client";

import React from "react";
import OrderDialog from "../dialog/OrderDialog";
import type { Order } from "@/state/API/ApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

type Props = { orderData: Order };

const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending":
      return {
        border: "border-b-4 border-b-amber-500",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    case "accepted":
      return {
        border: "border-b-4 border-b-indigo-500",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dot: "bg-indigo-500",
      };
    case "paid":
      return {
        border: "border-b-4 border-b-teal-500",
        badge: "bg-teal-50 text-teal-700 border-teal-200",
        dot: "bg-teal-500",
      };
    case "delivering":
      return {
        border: "border-b-4 border-b-blue-500",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
      };
    case "sold":
      return {
        border: "border-b-4 border-b-emerald-600",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-600",
      };
    case "cancelled":
      return {
        border: "border-b-4 border-b-rose-600",
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-600",
      };
    default:
      return {
        border: "border-b-4 border-b-gray-400",
        badge: "bg-gray-50 text-gray-700 border-gray-200",
        dot: "bg-gray-400",
      };
  }
};

const OrderCard = ({ orderData }: Props) => {
  const { user } = useSelector((state: RootState) => state.api);
  const isSeller = !!user?.isSeller;

  const counterParty = isSeller ? orderData.buyer : orderData.product?.seller;
  const displayName =
    counterParty?.name?.trim() ||
    counterParty?.email ||
    (isSeller ? "Buyer" : "Seller");

  // Compute initials safely
  const nameParts = displayName.split(/\s+/).filter(Boolean);
  let initials = "";
  if (nameParts.length > 0) {
    initials += nameParts[0].charAt(0);
    if (nameParts.length > 1) {
      initials += nameParts[nameParts.length - 1].charAt(0);
    }
  } else {
    initials = isSeller ? "B" : "S";
  }
  initials = initials.toUpperCase();

  const statusStyle = getStatusStyle(orderData.status);

  return (
    <div
      className={`m-3 text-gray-700 border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow bg-white w-full max-w-[420px] ${statusStyle.border}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="font-bold text-gray-900 text-base">
            #{orderData.id}
          </span>
          <span>•</span>
          <span>{new Date(orderData.createdAt).toLocaleDateString()}</span>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${statusStyle.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
          {orderData.status}
        </span>
      </div>

      <div className="mb-5">
        <h2 className="font-bold text-lg text-gray-900 line-clamp-1">
          {orderData.product?.title || "Product"}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {orderData.product?.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-lg bg-gray-50 mb-5 text-center text-sm">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Qty</p>
          <p className="font-bold text-gray-800 mt-0.5">{orderData.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Unit</p>
          <p className="font-bold text-gray-800 mt-0.5">
            ${orderData.product?.price}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
          <p className="font-bold text-teal-700 mt-0.5">
            ${(orderData.product?.price * orderData.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <div className="flex gap-3 items-center min-w-0">
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              {isSeller ? "Customer" : "Seller"}
            </p>
            <p className="font-semibold text-gray-900 text-sm truncate">
              {displayName}
            </p>
          </div>
        </div>

        <OrderDialog orderData={orderData} />
      </div>
    </div>
  );
};

export default OrderCard;
