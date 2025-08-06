import React from "react";
import Link from "next/link";
import ProductSearch from "../forms/ProductSearch";

const Nav = () => {
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
        <Link href="/" className="hover:text-[rgb(56,177,151)]">
          Products
        </Link>
        <Link href="/myorder" className="hover:text-[rgb(56,177,151)]">
          My Orders
        </Link>
        <Link href="/accounts" className="hover:text-[rgb(56,177,151)]">
          Accounts
        </Link>
        <Link href="/notification" className="hover:text-[rgb(56,177,151)]">
          Notification
        </Link>
        <Link href="/notification" className="hover:text-[rgb(56,177,151)]">
          Cart
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
