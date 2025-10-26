"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductSearch from "../forms/ProductSearch";
import { ShoppingCart, Bell, CircleUserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();
  const [location, setLocation] = useState(pathname);

  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);

  return (
    <nav
      className="flex justify-between items-center py-8 px-16 border border-gray-300 drop-shadow-2xl bg-white
      "
    >
      <h1 className="font-bold text-3xl text-[rgb(56,177,151)]">
        Easy<span className="text-gray-800">Buy</span>
      </h1>
      <h1 className="text-xl">Hello Natnael Getachew</h1>
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
          href="/myorder"
          className={`hover:text-[rgb(56,177,151)] ${
            location === "/myorder" && "text-[rgb(56,177,151)]"
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
