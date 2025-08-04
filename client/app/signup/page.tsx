import React from "react";
import Link from "next/link";
import RegisterationForm from "@/compoenents/forms/RegisterationForm";

const Page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-[80%] h-[80%] flex border border-gray-100 rounded-xl bg-white drop-shadow-lg ">
        {/* sign in to easy buy  */}
        <div className="w-1/4 bg-[rgb(56,177,151)] text-white">
          <h1 className="p-5 font-bold">EasyBuy</h1>
          <div className="flex flex-col items-center justify-center gap-6 w-full h-[90%]">
            <h1 className="text-5xl font-bold ">Welcome Back!</h1>
            <div className="flex flex-col justify-center items-center">
              To keep Conntected with us please
              <span>login with your personal info</span>
            </div>
            <Link href="/login">
              <button className="py-3 px-20 border border-white rounded-full hover:bg-white hover:text-[rgb(56,177,151)] cursor-pointer">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>
        {/* sign in to easy buy  */}
        <div className="w-3/4 flex-col h-full">
          <div className="flex flex-col justify-center items-center h-full w-full">
            <p className=" text-4xl font-extrabold text-[rgb(56,177,151)] mb-16 ">
              Create Account
            </p>
            <RegisterationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
