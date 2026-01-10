"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validationSchema";
import { z } from "zod";
// import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/assests/icons/loading.png";

// redux
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { loginAsync } from "@/state/API/ApiSlice";

type LoginForm = z.infer<typeof loginSchema>;

const LoginForm = () => {
  // for redux
  const api = useSelector((state: RootState) => state.api.loginResponse);
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSeller, setIsSeller] = useState(0);
  const router = useRouter();

  const { user, loading, initialized } = useSelector(
    (state: RootState) => state.api
  );

  if (initialized && user?.isSeller) {
    router.push("/product");
  } else if (initialized && !user?.isSeller && user) {
    router.push("/");
  }

  // for zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await dispatch(loginAsync(data)).unwrap();
      setIsSeller(response?.isSeller ? 1 : 2);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("isSeller value:", isSeller);
    isSeller === 1
      ? router.push("/product")
      : isSeller === 2 && router.push("/");
  }, [isSeller, router]);

  return (
    <div className="w-full">
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col items-center justify-center w-full"
      >
        <input
          type="email"
          id=""
          {...register("email")}
          placeholder="Email"
          className="w-[45%] p-5 bg-[rgb(244,248,247)]"
        />
        <p className="text-red-500">{errors.email?.message}</p>
        <br />
        <input
          type="password"
          id=""
          {...register("password")}
          placeholder="Password"
          className="w-[45%] p-5  bg-[rgb(244,248,247)]"
        />
        <p className="text-red-500">{errors.password?.message}</p>
        <br />
        <a href="" className="mb-6">
          Forget your Password?
        </a>{" "}
        <br />
        <button className="py-4 px-18 bg-[rgb(56,177,151)] rounded-full text-white font-bold text-sm">
          {isLoading ? (
            <Image src={Loading} alt="" className="animate-spin w-6" />
          ) : (
            "SING IN"
          )}
        </button>
        <p className="text-red-500">{error}</p>
      </form>
    </div>
  );
};

export default LoginForm;
