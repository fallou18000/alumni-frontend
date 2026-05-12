import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import RegisterAlumni from "./pages/RegisterAlumni";
import ChangePassword from "./pages/ChangePassword";

import AlumniDashboard from "./pages/alumni/AlumniDashboard";
import Profile from "./pages/alumni/Profile";
import DocumentsPage from "./pages/Documents/DocumentsPage";
import AlumniNetwork from "./pages/network/AlumniNetwork";
import Chat from "./pages/chat/Chat";
import AppLayout from "./pages/chat/AppLayout";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MainLayout from "./pages/layout/MainLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/admin/AdminRoute";
import CreateUser from "./pages/admin/CreateUser";
import About from "./pages/alumni/About";
import PublicProfile from "./pages/alumni/PublicProfile";
import ResponsableDashboard from "./pages/responsable/ResponsableDashboard";

 const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user || user === "undefined") return null;
  return JSON.parse(user);
};

function App() {
 
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<RegisterAlumni />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />  
        {/* <Route path="/about" element={<About />} /> */}

        {/* 🔥 ALUMNI APP (WITH NAVIGATION) */}
         <Route element={<MainLayout />}>
          <Route path="/alumni" element={<AlumniDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/network" element={<AlumniNetwork />} />
          <Route path="/chat/:userId" element={<Chat />} />
          {/* <Route path="/messages" element={<AppLayout />} /> */}
          <Route path="/alumni/profile/:id" element={<PublicProfile />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route path="/set-password" element={<ChangePassword />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/user/:id" element={<Profile />} />

    <Route
  path="/responsable"
  element={
    user?.role_id === 3
      ? <ResponsableDashboard />
      : <Login />
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;