// "use client";
// import axios from "axios";
// import React, { useState } from "react";

// const Page = () => {
//   const [res, setRes] = useState();

//   const handleClick = async () => {
//     try {
//       const response: any = await axios.get(
//         "https://easy-buy-qa2t.onrender.com/auth/me",
//         {
//           withCredentials: true,
//         }
//       );
//       setRes(response);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="flex w-screen h-screen flex-col justify-center items-center gap-5">
//       <button onClick={handleClick}>send request</button>
//       <p>response {res}</p>
//     </div>
//   );
// };

// export default Page;
