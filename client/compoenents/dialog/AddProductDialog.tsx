"use client";
import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductSchema } from "@/lib/validationSchema";

import { set, z } from "zod";
import Image from "next/image";
import Loading from "@/assests/icons/loading.png";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { addProductAsync } from "@/state/API/ApiSlice";

import { Dialog } from "@radix-ui/themes";

type ProductForm = z.infer<typeof addProductSchema>;

const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState();

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    try {
      const response = await dispatch(addProductAsync(data)).unwrap();
      console.log("response on form", response);
      setOpen(false);
    } catch (err: unknown) {
      console.log("from form", err);
      // setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(addProductSchema),
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button className="flex items-center gap-2 bg-black text-white font-bold cursor-pointer p-3 rounded">
          Add Product
        </button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="600px">
        <Dialog.Title>Add New Product</Dialog.Title>
        <Dialog.Description>
          Please fill in the form below to add a new product.
        </Dialog.Description>
        <div className="w-full mx-auto bg-gray-100 my-20">
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="bg-white flex flex-col items-center justify-center w-full"
          >
            <h1 className="text-4xl font-bold text-gray-800 m-5">
              App Product
            </h1>
            <input
              type="text"
              id="title"
              {...register("title")}
              placeholder="Product Name"
              className="w-[80%] p-5  bg-[rgb(244,248,247)]"
            />{" "}
            <p className="text-red-500">{errors.title?.message}</p>
            <br />
            <input
              type="number"
              id="quantity"
              {...register("quantity", { valueAsNumber: true })}
              placeholder="Quantity"
              className="w-[80%] p-5  bg-[rgb(244,248,247)]"
            />{" "}
            <p className="text-red-500">{errors.quantity?.message}</p>
            <br />
            <input
              type="text"
              {...register("category")}
              id="category"
              placeholder="Category"
              className="w-[80%] p-5  bg-[rgb(244,248,247)]"
            />
            <p className="text-red-500">{errors.category?.message}</p>
            <br />
            <input
              type="text"
              id="imageURL"
              {...register("imageUrl")}
              placeholder="Image URL"
              className="w-[80%] p-5  bg-[rgb(244,248,247)]"
            />{" "}
            <p className="text-red-500">{errors.imageUrl?.message}</p>
            <br />
            <input
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
              placeholder="Price"
              className="w-[80%] p-5  bg-[rgb(244,248,247)]"
            />{" "}
            <p className="text-red-500">{errors.price?.message}</p>
            <br />
            <input
              type="text"
              id="description"
              {...register("description")}
              placeholder="Description"
              className="w-[80%] p-5  bg-[rgb(244,248,247)]"
            />{" "}
            <p className="text-red-500">{errors.description?.message}</p>
            <br />
            <button
              type="submit"
              className="py-4 px-18 bg-[rgb(56,177,151)] rounded-full text-white font-bold text-sm"
            >
              {isLoading ? (
                <Image src={Loading} alt="" className="animate-spin w-6" />
              ) : (
                "Add Product"
              )}
            </button>
            <p className="text-red-500">{error}</p>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddProductDialog;
