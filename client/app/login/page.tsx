import Link from "next/link";
import LoginForm from "@/compoenents/forms/LoginForm";

const Page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-[80%] h-[80%] flex border border-gray-100 rounded-xl bg-white drop-shadow-lg ">
        {/* sign in to easy buy  */}
        <div className="w-3/4 flex-col h-full">
          <h1 className="p-5 font-bold">EasyBuy</h1>
          <div className="flex flex-col justify-center items-center h-full w-full">
            <p className=" text-4xl font-extrabold text-[rgb(56,177,151)] mb-16 ">
              Sign in to EasyBuy
            </p>
            <LoginForm />
          </div>
        </div>
        {/* sign in to easy buy  */}
        <div className="w-1/4 bg-[rgb(56,177,151)] flex flex-col items-center justify-center text-white gap-6">
          <h1 className="text-5xl font-bold ">Hello, Friend!</h1>
          <p>
            Enter your personal details <br /> and start journey with us
          </p>
          <Link href="signup">
            <button className="py-3 px-20 border border-white rounded-full hover:bg-white hover:text-[rgb(56,177,151)] cursor-pointer">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
