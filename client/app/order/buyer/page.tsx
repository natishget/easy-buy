"use client";

import { useEffect } from "react";
import Orders from "./orders";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { protectedRouteAsync } from "@/state/API/ApiSlice";

export default function BuyerOrderPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, initialized } = useSelector((state: RootState) => state.api);

  useEffect(() => {
    dispatch(protectedRouteAsync());
  }, [dispatch]);

  useEffect(() => {
    if (user?.isSeller === true) {
      router.replace("/order/seller");
    }
  }, [initialized, user, router]);

  return (
    <div className="p-10">
      <Orders />
    </div>
  );
}
