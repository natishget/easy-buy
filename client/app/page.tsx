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

  const [products, setProducts] = useState<Product[]>([]);

  const router = useRouter();
  const { user, loading, initialized } = useSelector(
    (state: RootState) => state.api
  );

  useEffect(() => {
    dispatch(protectedRouteAsync());
  }, [dispatch]);

  // useEffect(() => {
  //   if (initialized && !user) {
  //     router.replace("/login");
  //   }
  // }, [initialized, user, router]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        console.log("calling the Slice");
        const response = (await dispatch(
          getAllProducts()
        ).unwrap()) as Product[];
        setProducts(response);
      } catch (error) {
        alert(error);
        console.log("error trying to get all the products", error);
      }
    };
    if (initialized && user) getProducts();
  }, [dispatch, initialized, user]);

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
    <div className="h-fit w-screen bg-gray-150">
      {/* Products*/}
      <div className="mx-16 mt-10 flex gap-10 flex-wrap">
        {/* Product card*/}
        {products.map((product, index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </div>
  );
}
