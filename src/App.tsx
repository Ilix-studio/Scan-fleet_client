import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { toastConfig } from "@/config/Toastconfig";
import { AppRoutes } from "@/AppRoutes";
import "./App.css";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Toaster {...toastConfig} />
      <AppRoutes />
    </>
  );
};

export default App;
