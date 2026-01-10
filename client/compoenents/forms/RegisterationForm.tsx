"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validationSchema";
import { z } from "zod";
// import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/assests/icons/loading.png";

// for redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { registerAsync } from "@/state/API/ApiSlice";

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterationForm = () => {
  // for redux
  const api = useSelector((state: RootState) => state.api.registerResponse);
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { user, loading, initialized } = useSelector(
    (state: RootState) => state.api
  );

  if (initialized && user?.isSeller) {
    router.push("/product");
  } else if (initialized && !user?.isSeller && user) {
    router.push("/");
  }

  // for zod form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    console.log("data from form", data);
    try {
      const response = await dispatch(registerAsync(data));
      // console.log("response on form", response);
      router.push("/login");
    } catch (error: any) {
      console.log("from form", error);
      setError(error?.payload || error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className=" flex flex-col items-center justify-center w-full"
      >
        <input
          type="text"
          id="name"
          {...register("name")}
          placeholder="Full Name"
          className="w-[45%] p-5  bg-[rgb(244,248,247)]"
        />{" "}
        <p className="text-red-500">{errors.name?.message}</p>
        <br />
        <input
          type="tel"
          id="phone"
          inputMode="numeric"
          {...register("phone")}
          placeholder="Phone Number"
          className="w-[45%] p-5  bg-[rgb(244,248,247)]"
        />{" "}
        <p className="text-red-500">{errors.phone?.message}</p>
        <br />
        <input
          type="email"
          {...register("email")}
          id="email"
          placeholder="Email"
          className="w-[45%] p-5  bg-[rgb(244,248,247)]"
        />
        <p className="text-red-500">{errors.email?.message}</p>
        <br />
        <input
          type="password"
          id="password"
          {...register("password")}
          placeholder="Password"
          className="w-[45%] p-5  bg-[rgb(244,248,247)]"
        />{" "}
        <p className="text-red-500">{errors.password?.message}</p>
        <br />
        <input
          type="password"
          id="confirm"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          className="w-[45%] p-5  bg-[rgb(244,248,247)]"
        />{" "}
        <p className="text-red-500">{errors.confirmPassword?.message}</p>
        <br />
        <div className=" gap-3 justify-center w-[40%]">
          <div className="">
            <input
              type="radio"
              id="buyer"
              value="buyer"
              {...register("isSeller")}
            />
            <label htmlFor="buyer" className="">
              Buyer
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="seller"
              value="seller"
              {...register("isSeller")}
            />
            <label htmlFor="seller">Seller</label>
          </div>
        </div>
        <p className="text-red-500">{errors.isSeller?.message}</p>
        <br />
        <br />
        <button
          type="submit"
          className="py-4 px-18 bg-[rgb(56,177,151)] rounded-full text-white font-bold text-sm"
        >
          {isLoading ? (
            <Image src={Loading} alt="" className="animate-spin w-6" />
          ) : (
            "SIGN UP"
          )}
        </button>
        <p className="text-red-500">{error}</p>
      </form>
    </div>
  );
};

export default RegisterationForm;
