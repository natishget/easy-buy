import React from "react";
import CartComponent from "./cartComponent";

const cart = () => {
  return (
    <div className=" m-5">
      <h1 className="text-2xl font-bold m-6">Your Cart</h1>
      <CartComponent />
    </div>
  );
};

export default cart;
