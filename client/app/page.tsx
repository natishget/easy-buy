// import Image from "next/image";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/compoenents/cards/ProductCard";
import Nav from "@/compoenents/nav&foot/Nav";

export default function Home() {
  const products = [
    {
      id: 1,
      image: "/product1.jpeg",
      name: "P5 wireless Headset",
      price: 2000,
      quantity: 10,
    },
    {
      id: 2,
      image: "/product2.jpg",
      name: "Cosmotics",
      price: 2000,

      quantity: 10,
    },
    {
      id: 3,
      image: "/product1.jpeg",
      name: "P5 wireless Headset2",
      price: 2000,

      quantity: 10,
    },
    {
      id: 4,
      image: "/product1.jpeg",
      name: "P5 wireless Headset3",
      price: 2000,

      quantity: 10,
    },
    {
      id: 5,
      image: "/product2.jpg",
      name: "Cosmotics",
      price: 2000,

      quantity: 0,
    },
    {
      id: 6,
      image: "/product2.jpg",
      name: "Cosmotics",
      price: 2000,

      quantity: 10,
    },
    {
      id: 7,
      image: "/product2.jpg",
      name: "Cosmotics",
      price: 2000,

      quantity: 10,
    },
    {
      id: 8,
      image: "/product1.jpeg",
      name: "P5 wireless Headset7",
      price: 2000,

      quantity: 0,
    },
  ];
  return (
    <div className="h-fit w-screen bg-gray-150">
      {/* Nav Bar */}
      <Nav />
      {/* Products*/}
      <div className="mx-16 mt-10 flex gap-10 flex-wrap">
        {/* Product card*/}

        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
