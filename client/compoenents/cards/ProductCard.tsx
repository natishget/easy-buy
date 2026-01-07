import React from "react";
import Image from "next/image";
import AddToCart from "../buttons/AddToCart";

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

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div
      className="border border-gray-100 bg-white w-fit shadow-2xl rounded-xl"
      key={product.id}
    >
      <div>
        <Image
          src={product?.imageUrl || "/placeholder.jpg"}
          alt="product image"
          className="rounded-xl aspect-square object-cover"
          width={300}
          height={100}
        />
        <h1 className="mt-3 font-bold pl-3">Price: {product.price}Birr</h1>
        <p className="text-gray-500 pl-3">{product.title}</p>
        <p className="pl-3 font-bold">
          Quantity:{" "}
          {product.quantity === 0 ? (
            <span className="text-red-700">Out of Stock</span>
          ) : (
            <span className="text-teal-500">{product.quantity}</span>
          )}
        </p>
      </div>
      <AddToCart product={product} position={"horizontal"} />
    </div>
  );
};

export default ProductCard;
