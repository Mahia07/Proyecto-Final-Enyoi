import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RegisterForm from "./Components/Register/Register";
import SideBar from "./Components/navBar/navBar";
import LoginForm from "./Components/Login/Login";
import Tasks from "./Components/tasks/Tasks";
import Category from "./Components/Categories/Solution";
import Profile from "./Components/profile/Profile";
import ForgotPasswordForm from "./Components/forgotPassword/forgotPasswordForm";
import ResetPassword from "./Components/forgotPassword/forgotPassword";
import "./index.css";


const AppRoutes = () => {
  const location = useLocation();


  const hideSideBarRoutes = ["/", "/login", "/register", "/forgotpassword"];
  const isResetPassword = location.pathname.startsWith("/reset-password");

  const shouldHideSideBar = hideSideBarRoutes.includes(location.pathname.toLowerCase()) || isResetPassword;

  return (
    <>
      {!shouldHideSideBar && <SideBar />}
      <Routes>
        <Route index element={<LoginForm />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Home" element={<Tasks />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />
        <Route path="/Register" element={<RegisterForm />} />
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
