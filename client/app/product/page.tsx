"use client";
import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/state/API/ApiSlice";

import { z } from "zod";
import Image from "next/image";
import Loading from "@/assests/icons/loading.png";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { getSellerProducts } from "@/state/API/ApiSlice";

import SellerProductCard from "@/compoenents/cards/SellerProductCard";
import AddProductDialog from "@/compoenents/dialog/AddProductDialog";

const ProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [products, setProducts] = useState<Product[]>([]);

  const [error, setError] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await dispatch(getSellerProducts()).unwrap();
        setProducts(response);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-screen h-fit bg-gray-150 p-16">
      <div className="flex justify-end ">
        <AddProductDialog />
      </div>
      <div className="flex flex-wrap gap-5  mt-10 ">
        {products.map((product) => (
          <SellerProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
