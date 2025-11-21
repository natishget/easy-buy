import React from "react";
import CartComponent from "./cartComponent";
import Receipt from "./receipt";

const cart = () => {
  return (
    <div className=" m-5">
      <h1 className=" text-2xl font-bold m-6">Your Cart</h1>
      <div className="flex justify-between">
        <CartComponent />
        <Receipt />
      </div>
    </div>
  );
};

export default cart;
