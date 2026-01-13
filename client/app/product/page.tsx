"use client";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getSellerProducts } from "@/state/API/ApiSlice";

import SellerProductCard from "@/compoenents/cards/SellerProductCard";
import AddProductDialog from "@/compoenents/dialog/AddProductDialog";

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Product } = useSelector((state: RootState) => state.api);

  useEffect(() => {
    dispatch(getSellerProducts());
  }, [dispatch]);

  return (
    <div className="w-screen h-fit bg-gray-150 p-16">
      <div className="flex justify-end ">
        <AddProductDialog />
      </div>
      <div className="flex flex-wrap gap-5  mt-10 ">
        {Product.map((product) => (
          <SellerProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
