"use client";

import React, { useEffect } from "react";
import OrderCard from "@/compoenents/cards/orderCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getSellerOrdersAsync } from "@/state/API/ApiSlice";
import { Loader2, PackageOpen } from "lucide-react";

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.api.SellerOrder);
  const loading = useSelector((state: RootState) => state.api.loading);

  useEffect(() => {
    dispatch(getSellerOrdersAsync());
  }, [dispatch]);

  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
        <p className="text-base font-medium">Loading customer orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-16 text-gray-500">
        <PackageOpen className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-xl font-semibold">No customer orders yet</p>
        <p className="text-sm text-gray-400 mt-1">Orders placed for your products will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} orderData={order} />
      ))}
    </div>
  );
};

export default Orders;
