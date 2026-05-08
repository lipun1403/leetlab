// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Navbar from '../components/Navbar.jsx'

// const Layout = () => {
//   return (
//     <div>
//         <Navbar/>
//         <Outlet/>
//     </div>
//   )
// }

// export default Layout



import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Layout;