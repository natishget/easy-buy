"use client";

import Orders from "./orders";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { protectedRouteAsync } from "@/state/API/ApiSlice";
import { useRouter } from "next/navigation";

export default function SellerOrderPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const response = await dispatch(protectedRouteAsync()).unwrap();
        console.log("protectedRoute response:", response);
        setUserInfo(response);
      } catch (err: any) {
        console.error("failed to load protected route:", err);
        // show a friendly message (err may be an object)
        alert(err?.message || JSON.stringify(err) || "Failed to load user");
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !userInfo?.isSeller) {
      router.replace("/404");
    }
  }, [loading, userInfo, router]);

  if (loading)
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="p-10">
      <Orders />
    </div>
  );
}
