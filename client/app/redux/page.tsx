"use client";

import {
  decrement,
  increment,
  incrementByNumber,
  decrementByNumber,
  incrementAsync,
} from "@/state/API/counterSlice";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Page = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>{count}</h1>
      <div className="flex gap-3">
        <button onClick={() => dispatch(increment())}>increment</button>
        <button onClick={() => dispatch(decrement())}>decrement</button>
      </div>
      <button onClick={() => dispatch(incrementByNumber(5))} className="ml-5">
        increment by amount
      </button>
      <button onClick={() => dispatch(decrementByNumber(5))}>
        decrement by amount
      </button>
      <button onClick={() => dispatch(incrementAsync(10))}>
        increment Async
      </button>
    </div>
  );
};

export default Page;
