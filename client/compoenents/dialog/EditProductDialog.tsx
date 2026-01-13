import React, { useState, useEffect } from "react";

import { Dialog } from "@radix-ui/themes";
import { Pencil } from "lucide-react";
import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import { Product } from "@/state/API/ApiSlice";
import { editProductAsync } from "@/state/API/ApiSlice";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Loading from "@/assests/icons/loading.png";
import Image from "next/image";
import { addProductSchema } from "@/lib/validationSchema";

type FormValues = z.infer<typeof addProductSchema>;

const EditProductDialog = ({ product }: { product: Product }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        editProductAsync({ product: { ...product, ...data }, id: product.id })
      ).unwrap();
      setOpen(false);
      // router.push("/login");
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
  } = useForm<FormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: product.title,
      quantity: product.quantity,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
    },
  });

  //   useEffect(() => {
  //     reset(product); // update if prop changes
  //   }, [product, reset]);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Pencil />

        {/* <Button>Edit profile</Button> */}
      </Dialog.Trigger>

      <Dialog.Content maxWidth="800px">
        <Dialog.Title>Edit Product</Dialog.Title>
        <Dialog.Description size="4">
          Make changes to your product.
        </Dialog.Description>
        <div className="w-full mx-auto bg-gray-100 my-20">
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="bg-white flex flex-col items-center justify-center w-full"
          >
            <div className="flex flex-col w-[60%] gap-1 text-gray-600">
              <label htmlFor="title">Product Name</label>
              <input
                type="text"
                id="title"
                {...register("title")}
                placeholder="Product Name"
                className=" p-5  bg-[rgb(244,248,247)]"
              />{" "}
              <p className="text-red-500">{errors.title?.message}</p>
            </div>
            <br />
            <div className="flex flex-col w-[60%] gap-1 text-gray-600">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                {...register("quantity", { valueAsNumber: true })}
                placeholder="Quantity"
                className=" p-5  bg-[rgb(244,248,247)]"
              />{" "}
              <p className="text-red-500">{errors.quantity?.message}</p>
            </div>
            <br />
            <div className="flex flex-col w-[60%] gap-1 text-gray-600">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                {...register("category")}
                id="category"
                placeholder="Category"
                className="p-5  bg-[rgb(244,248,247)]"
              />
              <p className="text-red-500">{errors.category?.message}</p>
            </div>
            <br />
            <div className="flex flex-col w-[60%] gap-1 text-gray-600">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="text"
                id="imageURL"
                {...register("imageUrl")}
                placeholder="Image URL"
                className=" p-5  bg-[rgb(244,248,247)]"
              />{" "}
              <p className="text-red-500">{errors.imageUrl?.message}</p>
            </div>
            <br />
            <div className="flex flex-col w-[60%] gap-1 text-gray-600">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                {...register("price", { valueAsNumber: true })}
                placeholder="Price"
                className="p-5  bg-[rgb(244,248,247)]"
              />{" "}
              <p className="text-red-500">{errors.price?.message}</p>
            </div>
            <br />
            <div className="flex flex-col w-[60%] gap-1 text-gray-600">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                {...register("description")}
                placeholder="Description"
                className=" p-5  bg-[rgb(244,248,247)]"
              />{" "}
              <p className="text-red-500">{errors.description?.message}</p>
            </div>
            <br />
            <br />
            <button
              type="submit"
              className="py-4 px-18 bg-[rgb(56,177,151)] rounded-full text-white font-bold text-sm"
            >
              {isLoading ? (
                <Image src={Loading} alt="" className="animate-spin w-6" />
              ) : (
                "Edit Product"
              )}
            </button>
            <p className="text-red-500">{error}</p>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditProductDialog;
