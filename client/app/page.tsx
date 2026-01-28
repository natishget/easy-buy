// import Image from "next/image";
"use client";

import ProductCard from "@/compoenents/cards/ProductCard";
import { useEffect, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getAllProducts } from "@/state/API/ApiSlice";
import { useRouter } from "next/navigation";
import { protectedRouteAsync } from "@/state/API/ApiSlice";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  sellerId: number;
  createdAt: string;
}

export default function Home() {
  // for redux
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const {
    user,
    loading,
    initialized,
    productPageMeta,
    Product: products = [],
  } = useSelector((state: RootState) => state.api);

  useEffect(() => {
    dispatch(protectedRouteAsync());
    dispatch(getAllProducts({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    console.log("products", products);
  }, []);

  if (!initialized && loading)
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        Loading...
      </div>
    );

  if (user?.isSeller) {
    router.replace("/product");
  }

  // if (initialized && !user && !loading) {
  //   router.replace("/login");
  // }

  return (
    <div className="h-fit w-screen bg-gray-150 flex flex-col justify-center items-center">
      {/* Products*/}
      <div className="mx-16 mt-10 flex gap-10 flex-wrap">
        {/* Product card*/}
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
      <div className="w-full flex flex-col items-center my-10">
        <p className="mt-10 text-gray-600">
          Total Products: {productPageMeta.totalItems}
        </p>
        <div className="mt-2">
          {Array.from(
            { length: productPageMeta.totalPages },
            (_, i) => i + 1,
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                dispatch(getAllProducts({ page: pageNum }));
              }}
              className={`mx-1 px-3 py-1 border border-[rgb(56,177,151)] text-white rounded ${
                pageNum === productPageMeta.page && "bg-[rgb(56,177,151)]"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
