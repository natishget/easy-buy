"use client";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getSellerProducts } from "@/state/API/ApiSlice";

import SellerProductCard from "@/compoenents/cards/SellerProductCard";
import AddProductDialog from "@/compoenents/dialog/AddProductDialog";

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Product, productPageMeta } = useSelector(
    (state: RootState) => state.api,
  );

  useEffect(() => {
    dispatch(getSellerProducts({ page: 1 }));
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
                dispatch(getSellerProducts({ page: pageNum }));
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
};

export default ProductPage;
