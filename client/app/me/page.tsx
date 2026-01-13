"use client";
import React from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/state/store";
// import { protectedRouteAsync } from "@/state/API/ApiSlice";

// interface User {
//   userId: string;
//   name: string;
//   email: string;
//   phone?: number;
//   isSeller?: boolean;
// }

const Page = () => {
  // const dispatch = useDispatch<AppDispatch>();
  // const [userInfo, setUserInfo] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await dispatch(protectedRouteAsync()).unwrap();
  //       console.log("protectedRoute response:", response);
  //       setUserInfo(response);
  //     } catch (err) {
  //       console.error("failed to load protected route:", err);
  //       // show a friendly message (err may be an object)
  //       alert(err || JSON.stringify(err) || "Failed to load user");
  //       setUserInfo(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadUser();
  // }, [dispatch]);

  // if (loading)
  //   return (
  //     <div className="flex w-screen h-screen items-center justify-center">
  //       Loading...
  //     </div>
  //   );

  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center gap-5">
      <p>
        {/* {userInfo
          ? `Welcome, ${userInfo.name + userInfo.userId + userInfo.isSeller}`
          : "Not authenticated"} */}
        Hello
      </p>
    </div>
  );
};

export default Page;
