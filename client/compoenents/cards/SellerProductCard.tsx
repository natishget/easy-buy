import React from "react";
import Image from "next/image";

import { Product } from "@/state/API/ApiSlice";

import { Pencil, Trash2 } from "lucide-react";
import EditProductDialog from "../dialog/EditProductDialog";
import ProductDeleteAlertDialog from "../dialog/ProductDeleteAlertDialog";

const SellerProductCard = ({ product }: { product: Product }) => {
  return (
    <div
      className="border border-gray-100 bg-white w-[300px] shadow-2xl rounded-xl text-lg text-gray-800"
      key={product.id}
    >
      <div>
        <Image
          src={product?.imageUrl || "/placeholder.jpg"}
          alt="product image"
          className="rounded-xl aspect-square object-cover mb-3"
          width={300}
          height={100}
        />
        <p className=" pl-3">
          Title: <span className="text-gray-500">{product.title}</span>
        </p>
        <h1 className="  pl-3">
          Price: <span className="text-gray-500">{product.price}</span>
        </h1>
        <p className="pl-3 ">
          Quantity:{" "}
          {product.quantity === 0 ? (
            <span className="text-red-700">Out of Stock</span>
          ) : (
            <span className="text-gray-500">{product.quantity}</span>
          )}
        </p>
        <p className="pl-3 ">
          Category: <span className="text-gray-500">{product.category}</span>
        </p>

        <p className="pl-3 ">
          Description: <br />{" "}
          <span className="text-gray-500">{product.description}</span>
        </p>
        <div className="flex justify-end m-3 gap-4 text-xs">
          <button className="px-2 py-2 text-white font-bold bg-[rgb(56,177,151)] rounded ">
            <EditProductDialog product={product} />
          </button>
          <button className="px-2 py-2 text-white font-bold bg-red-700 rounded">
            <ProductDeleteAlertDialog productId={product.id} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
