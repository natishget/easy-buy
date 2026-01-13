"use client";

import Orders from "./orders";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { protectedRouteAsync } from "@/state/API/ApiSlice";
import { useRouter } from "next/navigation";

export default function SellerOrderPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.api);

  useEffect(() => {
    dispatch(protectedRouteAsync());
  }, [dispatch]);

  if (user?.isSeller === false) {
    router.replace("/order/buyer");
  }

  return (
    <div className="p-10">
      <Orders />
    </div>
  );
}
