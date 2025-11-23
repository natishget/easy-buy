"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductSearch from "../forms/ProductSearch";
import { ShoppingCart, Bell, CircleUserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { protectedRouteAsync } from "@/state/API/ApiSlice";

interface User {
  UserId: string;
  name: string;
  email: string;
  phone?: number;
  isSeller?: boolean;
}

const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [location, setLocation] = useState(pathname);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(protectedRouteAsync()).unwrap();
        console.log("protectedRoute response:", response);
        setUserInfo(response);
      } catch (err: any) {
        console.log("failed to load protected route:", err);
        // show a friendly message (err may be an object)
        alert(err?.message || JSON.stringify(err) || "Failed to load user");
        router.push("/login");
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <nav
      className={`flex ${
        !userInfo && "hidden"
      } justify-between items-center py-8 px-16 border border-gray-300 drop-shadow-2xl bg-white
    `}
    >
      <h1 className="font-bold text-3xl text-[rgb(56,177,151)]">
        Easy<span className="text-gray-800">Buy</span>
      </h1>
      <h1 className="text-xl">Hello {userInfo?.name}</h1>
      <div className="flex items-center gap-10 text-lg font-semibold">
        <ProductSearch />
        <Link
          href="/"
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/" && "text-[rgb(56,177,151)]"
          }`}
        >
          Products
        </Link>
        <Link
          href={`${userInfo?.isSeller ? "/order/seller" : "/order/buyer"}`}
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/order/seller" || location === "/order/buyer"
              ? "text-[rgb(56,177,151)]"
              : ""
          }`}
        >
          My Orders
        </Link>

        <Link
          href="/notification"
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/notification" && "text-[rgb(56,177,151)]"
          }`}
        >
          <Bell />
        </Link>
        <Link
          href="/cart"
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/cart" && "text-[rgb(56,177,151)]"
          }`}
        >
          <ShoppingCart />
        </Link>
        <Link
          href="/cart"
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/profile" && "text-[rgb(56,177,151)]"
          }`}
        >
          <CircleUserRound />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
