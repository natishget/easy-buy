"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { protectedRouteAsync } from "@/state/API/ApiSlice";

interface User {
  UserId: string;
  name: string;
  email: string;
  phone: number;
  isSeller: boolean;
}

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [useInfo, setUserInfo] = useState<User>();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await dispatch(protectedRouteAsync()).unwrap();
        console.log("response for product", response);
        setUserInfo(response);
      } catch (error) {
        alert(error);
        console.log("error trying to get all the products", error);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center gap-5">
      <p>{useInfo ? `Welcome, ${useInfo.name}` : "Loading..."}</p>
    </div>
  );
};

export default Page;
