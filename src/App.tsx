import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./mainComponent/Home/Home";
import Signup from "./mainComponent/Pages/Signup";
import Login from "./mainComponent/Pages/Login";
import DecisionPage from "./mainComponent/Pages/DecisionPage";
import StickerEditor from "./mainComponent/Features/StickerEditor";
import TokenDisplay from "./mainComponent/Pages/TokenDisplay";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AdminDashboardPage from "./mainComponent/Layout/Admin/AdminDashboardPage";
import UserDashboardPage from "./mainComponent/Layout/Users/UserDashboardPage";
import AdminLogin from "./mainComponent/Layout/Admin/AdminLogin";

const App = () => {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          // Default options for all toasts
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: "14px",
            maxWidth: "420px",
            padding: "12px 16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          },
          // Specific styles for different toast types
          success: {
            duration: 4000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #10b981",
              background: "#f0fdf4",
              color: "#065f46",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #ef4444",
              background: "#fef2f2",
              color: "#991b1b",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              border: "1px solid #3b82f6",
              background: "#eff6ff",
              color: "#1e40af",
            },
          },
        }}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/decision-page' element={<DecisionPage />} />
        <Route path='/sticker-editor' element={<StickerEditor />} />
        <Route path='/token-wallet' element={<TokenDisplay />} />
        <Route path='/admin-dashboard' element={<AdminDashboardPage />} />
        <Route path='/user-dashboard' element={<UserDashboardPage />} />
        <Route path='/admin-login' element={<AdminLogin />} />
      </Routes>
    </>
  );
};

export default App;
