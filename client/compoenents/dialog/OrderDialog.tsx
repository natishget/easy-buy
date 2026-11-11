"use client";

import React, { useState } from "react";
import { Dialog } from "@radix-ui/themes";
import { ChevronRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Order } from "@/state/API/ApiSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatusAsync } from "@/state/API/ApiSlice";

type Props = { orderData: Order };

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "accepted":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "paid":
      return "bg-teal-100 text-teal-800 border-teal-300";
    case "delivering":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "sold":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "cancelled":
      return "bg-rose-100 text-rose-800 border-rose-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const OrderDialog = ({ orderData }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.api);
  const isSeller = !!user?.isSeller;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === "cancelled") {
      const confirmText = isSeller
        ? "Are you sure you want to reject/cancel this order? Stock will be restored."
        : "Are you sure you want to cancel this order?";
      if (!window.confirm(confirmText)) {
        return;
      }
    }

    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await dispatch(
        updateOrderStatusAsync({ orderId: orderData.id, status: newStatus }),
      ).unwrap();
      setSuccessMessage(`Order status updated to "${newStatus}"!`);
    } catch (error: unknown) {
      const err = error as { message?: string };
      setErrorMessage(
        typeof error === "string" ? error : err?.message || "Failed to update order status",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const counterParty = isSeller ? orderData.buyer : orderData.product?.seller;
  const counterPartyName =
    counterParty?.name?.trim() ||
    counterParty?.email ||
    (isSeller ? "Buyer" : "Seller");

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <button
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white p-2.5 rounded-full shadow transition-colors cursor-pointer"
          title="View Details"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="750px">
        <div className="flex justify-between items-start border-b border-gray-100 pb-3">
          <div>
            <Dialog.Title className="text-xl font-bold text-gray-900">
              Order #{orderData.id} Details
            </Dialog.Title>
            <Dialog.Description className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(orderData.createdAt).toLocaleDateString()}
            </Dialog.Description>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
              orderData.status,
            )}`}
          >
            {orderData.status}
          </span>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm">
          {/* Product Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Product Information
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Title:</span>
                <span className="font-medium text-gray-900">
                  {orderData.product?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Category:</span>
                <span className="font-medium text-gray-900">
                  {orderData.product?.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Quantity:</span>
                <span className="font-bold text-gray-900">
                  {orderData.quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Unit Price:</span>
                <span className="font-medium text-gray-900">
                  ${orderData.product?.price}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total Price:</span>
                <span className="font-bold text-teal-700 text-base">
                  ${(orderData.product?.price * orderData.quantity).toFixed(2)}
                </span>
              </div>
              {orderData.product?.description && (
                <div className="pt-2 text-xs text-gray-500 border-t border-gray-200">
                  <span className="font-semibold block text-gray-700 mb-1">
                    Description:
                  </span>
                  <p className="line-clamp-3">{orderData.product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer / Seller Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              {isSeller ? "Customer Information" : "Seller Information"}
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Name:</span>
                <span className="font-medium text-gray-900">
                  {counterPartyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">
                  {counterParty?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">
                  {counterParty?.phone || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Role:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {isSeller ? "Buyer" : "Seller"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons based on Role & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <Dialog.Close>
            <button
              type="button"
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Close
            </button>
          </Dialog.Close>

          <div className="flex flex-wrap items-center gap-3">
            {isSeller ? (
              // SELLER ACTIONS
              orderData.status === "pending" ? (
                <>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("accepted")}
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow text-sm transition-colors cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Accept Order
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("cancelled")}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow text-sm transition-colors cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Reject Order
                  </button>
                </>
              ) : orderData.status === "accepted" ? (
                <>
                  <span className="text-xs text-gray-500 italic">
                    Awaiting customer payment
                  </span>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("cancelled")}
                    className="inline-flex items-center gap-2 border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cancel Order
                  </button>
                </>
              ) : orderData.status === "paid" ? (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate("delivering")}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow text-sm transition-colors cursor-pointer"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Ship Order
                </button>
              ) : orderData.status === "delivering" ? (
                <span className="text-xs text-blue-700 font-medium bg-blue-50 py-1.5 px-3 rounded-lg border border-blue-200">
                  Order shipped • Awaiting customer delivery confirmation
                </span>
              ) : orderData.status === "sold" ? (
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
                  Order completed successfully
                </span>
              ) : orderData.status === "cancelled" ? (
                <span className="text-xs text-rose-700 font-medium bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
                  This order was cancelled
                </span>
              ) : null
            ) : (
              // BUYER ACTIONS
              orderData.status === "pending" ? (
                <>
                  <span className="text-xs text-gray-500 italic">
                    Awaiting seller acceptance
                  </span>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("cancelled")}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow text-sm transition-colors cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cancel Order
                  </button>
                </>
              ) : orderData.status === "accepted" ? (
                <>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("paid")}
                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow text-sm transition-colors cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Make Payment
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate("cancelled")}
                    className="inline-flex items-center gap-2 border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cancel Order
                  </button>
                </>
              ) : orderData.status === "paid" ? (
                <span className="text-xs text-teal-700 font-medium bg-teal-50 py-1.5 px-3 rounded-lg border border-teal-200">
                  Payment confirmed • Waiting for seller to ship
                </span>
              ) : orderData.status === "delivering" ? (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate("sold")}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow text-sm transition-colors cursor-pointer"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Delivery
                </button>
              ) : orderData.status === "sold" ? (
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
                  Delivery confirmed • Order completed
                </span>
              ) : orderData.status === "cancelled" ? (
                <span className="text-xs text-rose-700 font-medium bg-rose-50 py-1.5 px-3 rounded-lg border border-rose-200">
                  This order was cancelled
                </span>
              ) : null
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OrderDialog;
