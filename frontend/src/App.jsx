import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage.jsx";
import LoginPage from "./page/LoginPage.jsx";
import SignUpPage from "./page/SignUpPage.jsx";
import ProfilePage from "./page/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AddProblem from "./page/AddProblem.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import ProblemPage from "./page/ProblemPage.jsx";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-start'>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={ authUser?<HomePage/>:<Navigate to={"/login"}/>}/>
        </Route>
        <Route path='/login' element={ !authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
        <Route path='/signup' element={ !authUser?<SignUpPage/>:<Navigate to={"/"}/>}/>
        <Route path="/me" element={ !authUser?<Navigate to={"/login"}/>:<ProfilePage />}/>
        <Route path="/problem/:id" element={<ProblemPage />} />

        <Route element={<AdminRoute/>}>
          <Route path="/add-problem" element={authUser?.role === "ADMIN"?<AddProblem/>:<Navigate to={"/"}/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App