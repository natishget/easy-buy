"use client";
import React from "react";

interface Product {
  id: number;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

const AddToCart = ({ product }: { product: Product }) => {
  const handleClick = () => {
    console.log("product added to cart", product);
  };
  return (
    <div>
      <button className="mt-3 py-3 w-full bg-[rgb(56,177,151)] text-white font-bold rounded-xl">
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart;
