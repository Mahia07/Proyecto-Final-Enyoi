import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import RegisterForm from "./Components/Register/Register";
import SideBar from "./Components/navBar/navBar";
import LoginForm from "./Components/Login/Login";
import Tasks from "./Components/tasks/Tasks";
import Category from "./Components/Categories/Solution";
import Profile from "./Components/profile/Profile";
import ForgotPasswordForm from "./Components/forgotPassword/forgotPasswordForm";
import ResetPassword from "./Components/forgotPassword/forgotPassword";
import "./index.css";

function App() {
  return (
      <BrowserRouter>
      <SideBar/>
        <Routes>
          <Route index element={< LoginForm/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        <Route path="/Home" index element={<Tasks />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordForm/>}/>
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Category" element={<Category/>}/>
          <Route path="/Profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>

  );
}

export default App;
