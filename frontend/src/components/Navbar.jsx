// import React from "react"
// import { User, Code, LogOut } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore.js";
// import { Link } from "react-router-dom";
// import LogoutButton from "./LogoutButton.jsx";




// const Navbar = ()=>{

//     const {authUser} = useAuthStore()

//     console.log("AUTH_USER",authUser)

//     return (
//      <nav className="sticky top-0 z-50 w-full py-5">
//       <div className="flex w-full justify-between mx-auto max-w-4xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-4 rounded-2xl">
//         {/* Logo Section */}
//         <Link to="/" className="flex items-center gap-3 cursor-pointer">
//           <img src="/leetlab.svg" className="h-18 w-18 bg-primary/20 text-primary border-none px-2 py-2 rounded-full" />
//           <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
//           Leetlab 
//           </span>
//         </Link>

//         {/* User Profile and Dropdown */}
//         <div className="flex items-center gap-8">
//           <div className="dropdown dropdown-end">
//             <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row ">
//               <div className="w-10 rounded-full ">
//                 <img
//                   src={
//                     authUser?.image ||
//                     "https://avatar.iran.liara.run/public/boy"
//                   }
//                   alt="User Avatar"
//                   className="object-cover"
//                 />
//               </div>
           
//             </label>
//             <ul
//               tabIndex={0}
//               className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
//             >
//               {/* Admin Option */}
             

//               {/* Common Options */}
//               <li>
//                 <p className="text-base font-semibold">
                 
//                   {authUser?.name}

//                 </p>
//                 <hr className="border-gray-200/10" />
//               </li>
//               <li>
//                 <Link
//                   to="/me"
//                   className="hover:bg-primary hover:text-white text-base font-semibold"
//                 >
//                   <User className="w-4 h-4 mr-2" />
//                   My Profile
//                 </Link>
//               </li>
//               {authUser?.role === "ADMIN" && (
//                 <li>
//                   <Link
//                     to="/add-problem"
//                     className="hover:bg-primary hover:text-white text-base font-semibold"
//                   >
//                     <Code className="w-4 h-4 mr-1" />
//                     Add Problem
//                   </Link>
//                 </li>
//               )}
//               <li>
//                 <LogoutButton className="hover:bg-primary hover:text-white">
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </LogoutButton>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </nav>
//     )
// }


// export default Navbar;






import React, { useState, useEffect } from "react";
import {
  User,
  Code,
  LogOut,
  Folder,
  Search,
  Sun,
  Moon,
  Trophy,
  Flame,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useProblemStore } from "../store/useProblemStore";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const { problems, isProblemsLoading, getAllProblems } = useProblemStore();

  useEffect(() => {
    if (!authUser) return;

    window.requestIdleCallback(() => {
      getAllProblems();
    });
  }, [authUser, getAllProblems]);
  useEffect(() => {
    if (!authUser) return;

    const fetchDailyChallenge = async () => {
      try {
        const res = await axiosInstance.get("/daily-challenge");

        const challenge = res.data;

        setDailyChallenge({
          title: challenge.title,
          link: `/problem/${challenge.id}`,
        });
      } catch (error) {
        console.error("Failed to fetch daily challenge:", error);
      }
    };

    fetchDailyChallenge();
  }, [authUser]);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <nav className="sticky  w-full shrink-0 top-0 z-50 flex flex-wrap gap-15 items-center justify-between bg-primary/10 ">
      <div className="flex flex-row  shrink-0 w-full justify-between  items-center px-6 py-4 bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10">
        {/* Logo Section */}
        <div className="flex shrink-0 items-center flex-1">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/leetlab.svg"
              loading="lazy"
              decoding="async"
              className="h-12 w-12 bg-primary/10 rounded-full px-2 "
              alt="LeetLab Logo"
            />
            <span className="text-lg bg-primary/20 shadow-md rounded-xl px-4 py-1 text-white md:text-2xl font-bold tracking-tight hidden md:block">
              LeetLab
            </span>
          </Link>
        </div>

        {/* Daily Challenge */}
        <div className="  md:flex items-center shrink-0 text-center align-center justify-center">
          <div className="hidden md:flex flex-1 items-center gap-2 bg-primary/30 text-white px-4 py-2 rounded-lg shadow-md ">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <p className="text-sm font-semibold">Daily Challenge:</p>
            {dailyChallenge ? (
              <>
                <Link
                  to={dailyChallenge.link}
                  className="text-white font-bold hover:underline"
                >
                  {dailyChallenge.title}
                </Link>
              </>
            ) : (
              <span className="text-sm text-semibold px-4">
                Loading challenge
              </span>
            )}
          </div>
        </div>

        {/* Actions & User Dropdown */}
        <div className="flex-1 flex items-center justify-end gap-5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="btn btn-circle btn-ghost p-1 bg-primary/10 hover:bg-primary/20"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 border-white-400" />
            ) : (
              <Moon className="w-5 h-5 bg-amber-400-300" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-6">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar flex flex-row "
              >
                <div className="w-10 h-10 p-0.5 bg-primary/10 rounded-full ">
                  <img
                    src={
                      "../../man.png" ||
                      (authUser?.name ? authUser?.name.charAt(0) : "U")
                    }
                    alt="User Avatar"
                    className="object-cover"
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
              >
                <li>
                  <p className="text-base font-semibold">{authUser?.name}</p>
                  <hr className="border-gray-200/10" />
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/submissions"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    Submissions
                  </Link>
                </li>
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="hover:bg-primary hover:text-white text-base font-semibold"
                    >
                      <Code className="w-4 h-4 mr-1 pr-1" />
                      Add Problem
                    </Link>
                  </li>
                )}
                <li>
                  <LogoutButton className="hover:bg-primary hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;