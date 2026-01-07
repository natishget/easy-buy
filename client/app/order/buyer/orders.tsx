"use client";

import React, { useEffect, useState } from "react";
import OrderCard from "@/compoenents/cards/orderCard";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { getBuyerOrdersAsync } from "@/state/API/ApiSlice";

interface Order {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    seller: {
      id: number;
      name: string;
      phone: string;
      email: string;
      isSeller: boolean;
    };
  };
  buyer: {
    id: number;
    name: string;
    phone: string;
    email: string;
    isSeller: boolean;
  };
  quantity: number;
  createdAt: Date;
  status: string;
}

const Orders: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await dispatch(getBuyerOrdersAsync()).unwrap();
        setOrders(response);
      } catch (error) {
        console.log("Error fetching buyer orders:", error);
      }
    };

    fetchOrders();
  }, [dispatch]);
  return (
    <div className="w-fit flex flex-wrap ">
      {orders.map((order) => (
        <OrderCard key={order.id} orderData={order} />
      ))}
    </div>
  );
};

export default Orders;
