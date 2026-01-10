"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductSearch from "../forms/ProductSearch";
import { ShoppingCart, Bell, CircleUserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { logoutAsync, protectedRouteAsync } from "@/state/API/ApiSlice";

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

  const { user, loading, initialized } = useSelector(
    (state: RootState) => state.api
  );
  const cartProducts = useSelector((state: RootState) => state.cart.items);

  const handleLogout = async () => {
    // Implement logout functionality here
    await dispatch(logoutAsync());
  };

  useEffect(() => {
    dispatch(protectedRouteAsync());
  }, [dispatch]);

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await dispatch(protectedRouteAsync()).unwrap();
  //       console.log("protectedRoute response:", response);
  //       setUserInfo(response);
  //     } catch (err: any) {
  //       console.log("failed to load protected route:", err);
  //       // show a friendly message (err may be an object)
  //       alert(err?.message || JSON.stringify(err) || "Failed to load user");
  //       router.push("/login");
  //       setUserInfo(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadUser();
  // }, [dispatch]);

  return (
    <nav
      className={`flex ${
        !user && "hidden"
      } justify-between items-center py-8 px-16 border border-gray-300 drop-shadow-2xl bg-white
    `}
    >
      <h1 className="font-bold text-3xl text-[rgb(56,177,151)]">
        Easy<span className="text-gray-800">Buy</span>
      </h1>
      <h1 className="text-xl">Hello {user?.name}</h1>
      <div className="flex items-center gap-10 text-lg font-semibold">
        <ProductSearch />
        <Link
          href="/"
          className={`hover:text-[rgb(56,177,151)] ${
            !user?.isSeller ? "" : "hidden"
          } ${location === "/" && "text-[rgb(56,177,151)]"}`}
        >
          Products
        </Link>

        <Link
          href="/product"
          className={`hover:text-[rgb(56,177,151)] ${
            user?.isSeller ? "" : "hidden"
          } ${location === "/product" && "text-[rgb(56,177,151)]"}`}
        >
          My Products
        </Link>

        <Link
          href={`${user?.isSeller ? "/order/seller" : "/order/buyer"}`}
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
          className={`hover:text-[rgb(56,177,151)] relative ${
            user?.isSeller ? "hidden" : ""
          } ${location === "/cart" && "text-[rgb(56,177,151)]"}`}
        >
          <div
            className={`absolute w-5 h-5 rounded-full bg-red-600 text-white text-xs flex justify-center items-center bottom-4 -right-4 ${
              cartProducts.length === 0 && "hidden"
            }`}
          >
            {cartProducts.length}
          </div>
          <ShoppingCart />
        </Link>
        <Link
          href="/profile"
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/profile" && "text-[rgb(56,177,151)]"
          }`}
        >
          <div className="relative flex flex-col">
            <CircleUserRound />
            <div className="absolute flex flex-col mt-4 w-56  bg-white border border-gray-300 p-4 text-black hover:text-black rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity left-[-800%] ">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 flex justify-center items-center border border-teal-600 text-white text-semibold rounded-full">
                  {user?.name.charAt(0)}
                </div>
                <p>{user?.name}</p>
              </div>
              <div className=" border border-gray-600 "></div>
              <button
                className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-5 mt-3"
                onClick={() => {
                  handleLogout();
                  // router.push("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
