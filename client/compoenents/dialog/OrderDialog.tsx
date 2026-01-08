import React from "react";
// import * as Dialog from "@radix-ui/react-dialog";
import { Button, Text, Flex, TextField, Dialog } from "@radix-ui/themes";

import { ChevronRight } from "lucide-react";

import type { Order } from "@/state/API/ApiSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";

type Props = { orderData: Order };

const OrderDialog = ({ orderData }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading, initialized } = useSelector(
    (state: RootState) => state.api
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="flex items-center gap-2 bg-black text-white font-bold cursor-pointer p-3 rounded-full">
          <ChevronRight />
        </button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="850px">
        <Dialog.Title>Order Detail</Dialog.Title>
        <Dialog.Description className="text-sm">
          Full Description of the order with the buyer & seller information.
        </Dialog.Description>

        <div className="flex justify-between mx-8">
          <div className="flex flex-col gap-3">
            <div className="w-[80%] border-gray-700 border my-5"></div>
            <label htmlFor="product-information" className="text-xl font-bold">
              Product Information
            </label>

            <label className="mb-2 font-bold ">
              Product Name:{" "}
              <span className="text-gray-600">{orderData.product.title}</span>
            </label>
            <label className="mb-2 font-bold ">
              Quantity:{" "}
              <span className="text-gray-600">{orderData.quantity}</span>
            </label>
            <label htmlFor="" className="mb-2 font-bold ">
              Unit Price:{" "}
              <span className="text-gray-600">${orderData.product.price}</span>
            </label>
            <label htmlFor="" className="mb-2 font-bold ">
              Status:{" "}
              <span
                className={`text-teal-600 ${
                  orderData.status === "cancelled" && "text-red-600"
                } `}
              >
                {orderData.status}
              </span>
            </label>
            <label htmlFor="" className="mb-2 font-bold ">
              Category:{" "}
              <span className="text-gray-600">
                {orderData.product.category}
              </span>
            </label>
            <label htmlFor="" className="mb-2 font-bold">
              Description:{" "}
              <span className="text-gray-600">
                {orderData.product.description}
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-[80%] border-gray-700 border my-5"></div>
            <label htmlFor="product-information" className="text-xl font-bold">
              Buyer Information
            </label>

            <label className="mb-2 font-bold ">
              Buyer Name:{" "}
              <span className="text-gray-600">{orderData.buyer.name}</span>
            </label>
            <label className="mb-2 font-bold ">
              Phone:{" "}
              <span className="text-gray-600">{orderData.buyer.phone}</span>
            </label>
            <label htmlFor="" className="mb-2 font-bold ">
              Email:{" "}
              <span className="text-gray-600">{orderData.buyer.email}</span>
            </label>
          </div>
        </div>

        <div className=" w-full flex gap-3 mt-4 justify-end">
          {/* <Dialog.Close></Dialog.Close> */}
          {user?.isSeller ? (
            orderData.status === "pending" ? (
              <div className="flex gap-5">
                {" "}
                <button className="bg-teal-600 py-2 px-4 rounded text-white font-bold">
                  Accept Order
                </button>{" "}
                <button className="bg-red-600 py-2 px-4 rounded text-white font-bold">
                  {" "}
                  Reject Order
                </button>
              </div>
            ) : orderData.status === "paid" ? (
              <button>Ship Order</button>
            ) : null
          ) : (
            orderData.status === "waiting" && (
              <button className="bg-teal-600 py-2 px-4 rounded text-white font-bold">
                Make Payment
              </button>
            )
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OrderDialog;
