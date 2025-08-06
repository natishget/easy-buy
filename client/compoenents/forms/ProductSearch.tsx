"use client";
import React from "react";

const ProductSearch = () => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return (
    <input
      type="text"
      name=""
      id=""
      onChange={handleSearch}
      placeholder="Search for Product"
      className="p-3 bg-gray-100 rounded-lg"
    />
  );
};

export default ProductSearch;
