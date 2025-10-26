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
        const response = await dispatch(getAllProducts()).unwrap();
        console.log("response for product", response);
        setProducts(response);
      } catch (error) {
        alert(error);
        console.log("error trying to get all the products", error);
      }
    };
    getProducts();
  }, []);

  // const products = [
  //   {
  //     id: 1,
  //     image: "/product1.jpeg",
  //     name: "P5 wireless Headset",
  //     price: 2000,
  //     quantity: 10,
  //   },
  //   {
  //     id: 2,
  //     image: "/product2.jpg",
  //     name: "Cosmotics",
  //     price: 2000,

  //     quantity: 10,
  //   },
  //   {
  //     id: 3,
  //     image: "/product1.jpeg",
  //     name: "P5 wireless Headset2",
  //     price: 2000,

  //     quantity: 10,
  //   },
  //   {
  //     id: 4,
  //     image: "/product1.jpeg",
  //     name: "P5 wireless Headset3",
  //     price: 2000,

  //     quantity: 10,
  //   },
  //   {
  //     id: 5,
  //     image: "/product2.jpg",
  //     name: "Cosmotics",
  //     price: 2000,

  //     quantity: 0,
  //   },
  //   {
  //     id: 6,
  //     image: "/product2.jpg",
  //     name: "Cosmotics",
  //     price: 2000,

  //     quantity: 10,
  //   },
  //   {
  //     id: 7,
  //     image: "/product2.jpg",
  //     name: "Cosmotics",
  //     price: 2000,

  //     quantity: 10,
  //   },
  //   {
  //     id: 8,
  //     image: "/product1.jpeg",
  //     name: "P5 wireless Headset7",
  //     price: 2000,

  //     quantity: 0,
  //   },
  // ];
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
