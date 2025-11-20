// import Image from "next/image";
"use client";

import ProductCard from "@/compoenents/cards/ProductCard";
import { useEffect, useState } from "react";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { getAllProducts } from "@/state/API/ApiSlice";

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
  // const api = useSelector((state: RootState) => state.api.Product);
  const dispatch = useDispatch<AppDispatch>();

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [products, setProducts] = useState<Product[]>([]);

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
    getProducts();
  }, [dispatch]);

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
